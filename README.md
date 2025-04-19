# IP Hawks

> Project for CS5224 cloud computing AY24/25
> Intellectual Property (IP) analytics  [dashboard](https://frontend.ipos.naumansajid.com "IP Hawks WebPage")
![Logo](logo.png)  
## Usage  
```bash
https://frontend.ipos.naumansajid.com
```

## Features  
- ✅ OAuth Based Login  
- ✅ Trend Analytics for IPOS patents and filing
- ✅ Search for Patents and filings
- 🛠️ RAG Based Chat bot for patents (Work in Progress)
- 🛠️ Real time alert notifications (Work in Progress)
## Architecture Diagram  
![architecture_diagram](https://github.com/user-attachments/assets/54da967b-4a3a-4f31-baa2-9cd1e60ba8fb)


## Contributers
1. Sneha Kumar (snehakumaarr)
2. Nauman Sajid (Nauman-S)
3. Abdul Cader (caderpmh)
4. Li Yuting (8462lyt)
5. Cheng Siyuan (siyuancheng178)

## License  
[MIT](LICENSE)


### Description
IP Analytics platform powered by data from data.gov

Features are only accessible after authentication from a identity provider. Valid JSESSION ID and xcsrf token is required


- 🚀 Explore   - Search applications based on various criteria
- 🔎 Analytics - View Trends in patents
- 🤖 Chatbot   - RAG based chatbot for advanced queries
- 📥 Daily Alerts - Email notifications for newly listed patents


### Directory structure
```
📦 project-root/
├── 📂 .github/                      # Workflows
├── 📂 services/                     # Source code
│   ├── 🌱  ipos                     # Spring Boot Backend
|   |   ├── 🔑 .ebextensions         # AWS Configuration 
|   |   ├── 🔑 .platform             # AWS Configuration 
|   |   ├── 📂 src/
|   |   ├── 📜 pom.xml  
│   ├── 🐹 iposCron                  # Golang Cron for Mongo DB Population
|   └── 🐍 createEmbeddingsCron      # Python Cron for embeddings
├── 📂 ui/                           # React UI
│   ├── 📂 src/
│   └── 🔑 staticwebapp.config.json  # Azure Config
├── 📄 .gitignore
└── 📄 README.md                     # You are here! (Project overview)
```
