# AyuTrace
AyuTrace: A blockchain-inspired traceability system for Ayurvedic herbs 🌿 | Built with Node.js, Express, and CryptoJS | Immutable ledger with smart-contract validations for farmers, processors, testers, and manufacturers.
# 🌿 AyuTrace – Blockchain-based Ayurvedic Herb Traceability

AyuTrace is a lightweight blockchain-inspired prototype built for hackathon use.  
It provides **end-to-end traceability of Ayurvedic herbs** from **farmers → processors → testers → manufacturers → consumers**, using a custom blockchain ledger written in Node.js and secured with CryptoJS.

This project simulates how **blockchain transparency** can bring **trust, sustainability, and authenticity** into the herbal supply chain.

---

## 🚀 Features

- 📦 **Custom Blockchain Ledger**  
  - Genesis block, immutable hashes, previousHash links  
  - Ledger persisted in JSON (`ledger.json`)  

- ⚖️ **Smart Contracts (Validation Rules)**  
  - Geo-fence validation for approved collection zones  
  - Quality gates for moisture % and pesticide levels  

- 🌍 **Farmer DApp Simulation**  
  - Farmers can record harvest events with GPS coordinates  
  - Batch IDs automatically generated  

- 🧪 **Processor & Tester Dashboards**  
  - Add quality test results (moisture, pesticide, DNA barcode etc.)  
  - Record intermediate processing steps  

- 🏭 **Manufacturer Module**  
  - Finalizes product batches  
  - Generates QR code (future step) for consumer transparency  

- 🔍 **Consumer Portal (Simulated)**  
  - Scan QR → view full product journey (origin, tests, timestamps, etc.)  

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express  
- **Blockchain Logic:** Custom-built with `CryptoJS` (SHA256 hashing)  
- **Smart Contracts:** JavaScript validation functions  
- **Data Storage:** JSON file ledger (simulating distributed ledger)  
- **UUID:** Batch ID generation  



