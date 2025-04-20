# IP Hawks

> Project for CS5224 cloud computing AY24/25
> Intellectual Property (IP) analytics  [dashboard](https://frontend.ipos.naumansajid.com "IP Hawks WebPage")
## Usage  
```bash
https://frontend.ipos.naumansajid.com
```

## Test Account
### Login Credentials 
You may use your own Gmail account or the following test Gmail login credentials:  
Email: userabcdef775@gmail.com
Password: cs5224_pass

### Date Coverage for Search/Analytics
The current patents data in the search results and analytics dashboard covers patent filings in the lodgement date range of 28/09/2019 to 01/09/2020 (dd/mm/yy)


## Features  
- ✅ OAuth Based Login  
- ✅ Trend Analytics for IPOS Patents filing
- ✅ Search for Patents filings
- 🛠️ RAG Based Chat bot for patents (Work in Progress)
- 🛠️ Real time alert notifications (Work in Progress)
- 🛠️ Coverage of IPOS Trademarks and Designs (Work in Progress)

## Architecture Diagram  
![architecture_diagram drawio](https://github.com/user-attachments/assets/9df27d42-ab3c-4c92-b4e2-4df894a5673b)


## Contributors
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
- 🚀 Explore   - Search filings based on various criteria, enhanced with LLM-based semantic search capabilities
- 🔎 Analytics - View trends of IP filings
- 📥 Daily Alerts - Customizable email notifications for newly listed IP filings 
- 🤖 Chat   - RAG based chatbot for advanced queries


### Directory structure
```
📦 project-root/
├── 📂 .github/                      # Workflows
├── 📂 services/                     # Source code
│   ├── 🐍 createEmbeddingsCron      # Python Cron for embeddings
|   ├── 🌱  ipos                     # Spring Boot Backend
|   |   ├── 🔑 .ebextensions         # AWS Configuration 
|   |   ├── 🔑 .platform             # AWS Configuration 
|   |   ├── 📂 src/
|   |   ├── 📜 pom.xml  
│   └──  🐹 iposCron                 # Golang Cron for Mongo DB Population
├── 📂 ui/                           # React UI
│   ├── 📂 src/
│   └── 🔑 staticwebapp.config.json  # Azure Config
├── 📄 .gitignore
└── 📄 README.md                     # You are here! (Project overview)
```
