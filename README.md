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
- ✅ Analytics for IPOS patents and filing
- ✅ RAG Based Chat bot for understanding more about patents

## Architecture Diagram  
![architecture_diagram](https://github.com/user-attachments/assets/54da967b-4a3a-4f31-baa2-9cd1e60ba8fb)


## Contributers
1. Sneha Kumar 
2. Nauman Sajid (Nauman-S)
3. Abdul Cader (caderpmh)
4. Li Yuting 
5. Cheng Siyuan

## License  
[MIT](LICENSE)


### Description



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
│   └── 🐹 iposCron                  # Golang Cron
├── 📂 ui/                           # React UI
│   ├── 📂 src/
│   └── 🔑 staticwebapp.config.json  # Azure Config
├── 📄 .gitignore
└── 📄 README.md                     # You are here! (Project overview)
```
