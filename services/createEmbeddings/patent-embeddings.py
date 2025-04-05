import voyageai
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import requests
import pymupdf

### Set up Embedding API call ###
API_KEY = "pa-_qK_tqJVBdQLiI74GgTYhbyy9e-OXxPsrIauMP_zxhK"
vo = voyageai.Client(api_key=API_KEY)
MODEL_NAME = "voyage-3"

### Connect with MongoDB ###
uri = "mongodb+srv://sneha:hIbWKvknGSfA6Mcg@cluster0.jqvde.mongodb.net/?appName=Cluster0"
# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# access the patents collection 
db = client["ipos"]
collection = db["patent"]

### Process All Documents ### 
# All documents (filings) in patents that are new 
all_documents = collection.find({"documentsEmbeddings": {"$exists": False}})

for doc in all_documents:
    # get all urls 
    print(f'Document ID: {doc["_id"]}')

    ## Documents Embedding ##
    # Extract URL
    urls = [d["url"] for d in doc.get("documents", []) if "url" in d]

    embeddings_list = []
    for url in urls:
        try:
            response = requests.get(url)
            pdf_path = "temp.pdf"
            with open(pdf_path, "wb") as f:
                f.write(response.content)

            with pymupdf.open(pdf_path) as pdf_doc:
                text = "\n".join([page.get_text() for page in pdf_doc])

            if not text.strip():
                print(f"Skipping {url} - No text extracted.")
                continue

            doc_embedding = vo.embed(texts=[text], model=MODEL_NAME).embeddings[0]
            embeddings_list.append(doc_embedding)

        except Exception as e:
            print(f"Failed to process {url}: {e}")


    # Store embeddings at the document level
    collection.update_one({"_id": doc["_id"]}, {"$set": {"documentsEmbeddings": embeddings_list}})

    ## Title Embedding ##
    #Extract Title 
    title = doc["summary"]["TitleOfInvention"]
    title_embedding = vo.embed(texts=title, model=MODEL_NAME).embeddings[0]

    #Store embedding
    collection.update_one({"_id": doc["_id"]}, {"$set": {"titleEmbeddings": title_embedding}})