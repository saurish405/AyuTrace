**Qryptix (Saurish ke Sher🦁)**

**For frontend:**

**So first we will have a Farmers app that will have a registration or login page where they will register and then Entry page that will record data given in structure below.**

**Next we will have a Main website that will have a page imagine like our vtop that will have a different login and registration options for tester, processor and manufacturer like we have student login, faculty login and alumni login then they would have their different pages whose structure is given below. Then our final page will be the page you go through scanning the QR code that wont require login or anything you just go there after scanning the QR or the link which will show all the details recorded in the process with images, certificates and blockchain details. The images could be static for the particular group already in website not fetched through blockchain.**

**App / Website Structure**

**1\. Farmer DApp (Mobile-first, lightweight)**

- **Registration Page**
  - Name, phone number, Aadhaar/ID, location (geo-tag/GPS)
  - Type of crop(s) grown
  - Size of farm
  - Contact details
- **Production Entry Page**
  - Select crop
  - Total production (quantity, weight, units)
  - Harvest date
  - Optional: photo of harvest
  - Geo-location capture
  - Data sent either:
    - Online (to blockchain / backend API)
    - Offline (via SMS → parsed & uploaded later by gateway)

**2\. Processor Portal (Web)**

- **Login Page**
  - Role-based login (Processor)
- **Processor Dashboard**
  - View incoming batches from farmers
  - Select batch → record processing details:
    - Cleaning / grading info
    - Weight after processing
    - Processing location (geo-tag)
    - Date/time
    - Upload test/sample photo (if available)
  - Batch status update: “Processed”

**3\. Tester Portal (Web)**

- **Login Page**
  - Role-based login (Tester)
- **Tester Dashboard**
  - View list of processed batches awaiting test
  - For each batch, record:
    - Lab test certificate number / document (PDF or image upload)
    - Quality grade (A/B/C or numeric)
    - Chemical/pesticide residue levels (if applicable)
    - Date/time, location
  - Output: “Tested + Certified”

**4\. Manufacturer Portal (Web)**

- **Login Page**
  - Role-based login (Manufacturer)
- **Manufacturer Dashboard**
  - View all certified batches ready for packaging
  - Create **Product Pack**:
    - Select batch(s)
    - Define packaging size (1kg, 5kg, etc.)
    - Production date, expiry date
  - **Generate QR Code**
    - Each QR links to consumer page
    - QR printed/stuck on pack

**5\. Consumer Page (Public, No Login)**

- **Scan QR → Redirect to Product Journey Page**
- Show details in **timeline view**:
  - 🌱 Farmer: Name (optional), farm location, harvest date, photos
  - 🏭 Processor: Processing details, location, date/time
  - 🧪 Tester: Test certificate (download/view), results, date/time
  - 📦 Manufacturer: Packaging details, date, plant location
  - 🛒 Consumer: Static product image + message (“This product is blockchain-verified”)
- Optional:
  - Show blockchain hash for authenticity
  - Show QR unique ID

1. **Role-based Authentication** → Use JWT/session-based login with roles (farmer, tester, processor, manufacturer).
2. **Offline Support for Farmers** → SMS gateway or simple mobile form that caches until internet is available.
3. **Static Images** → Store images in backend (S3, IPFS, or even local storage for MVP), store link/hash in blockchain.
4. **QR Code** → Should contain:
    - Product batch ID
    - Blockchain reference hash / link
    - URL for consumer-facing details page
5. **Blockchain Storage** →
    - Keep large files (images, certificates) off-chain, only store hash + metadata in blockchain.

⚡️ With this structure:

- Farmers → record production
- Processors → record handling
- Testers → certify
- Manufacturers → package + QR
- Consumers → scan QR → see journey

To frontend ki basic site aur pages arka bana ke tumhe de dega. Saloni Your main work is to Design pages. Aur Sayali you need do the CSS to make that designs come to page .

