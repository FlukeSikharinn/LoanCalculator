# 🏦 LoanCalculator

LoanCalculator เป็นเว็บแอปพลิเคชันสำหรับคำนวณสินเชื่อแบบลดต้นลดดอกและระบบจัดการบทความเกี่ยวกับการเงินและสินเชื่อ ซึ่งจริงๆแล้วเป็นข้อสอบสมัครงานในตำแหน่ง developer ที่ผมได้สร้างขึ้นมา

## 🚀 Features
- 💸 **คำนวณสินเชื่อ**: คำนวณสินเชื่อแบบลดต้นลดดอกโดยจะแสดงผลลัพธ์ในรูปแบบ chart ต่างๆ และตารางการผ่อนในแต่งวดพร้อมรายละเอียดและสามารถเปิดเป็น PDF ได้
- 📝 **เปรียบเทียบสินเชื่อ**: คำนวณสินเชื่อแบบลดต้นลดดอกในเงื่อนไขที่ต่างกันและสามารถนำมาเปรียบเทียบกันได้และบอกว่าเงื่อนไขไหนจ่ายดอกเบี้ยต่ำสุด
- 📖 **อ่านและเขียนบทความ**: ทำ CRUD สำหรับ Blog artical 

## 🏗️ สถาปัตยกรรม (Architecture)
```sh
📂 nuxt-project/
├─ 📂 app/                     # โฟลเดอร์หลักของโปรเจค
│  ├─ 📂 assets/
│  │  └─ 📂 css/               # เก็บไฟล์ CSS / SCSS
│  │     └─ main.css
│  ├─ 📂 components/           # UI Components ใช้ซ้ำ
│  │  ├─ Navbar.vue
│  │  └─ BlogCard.vue
│  ├─ 📂 composables/          # ฟังก์ชัน reusable (hooks)
│  │  └─ useArticle.ts
│  ├─ 📂 layouts/              # Layout หลักของเพจ
│  │  └─ default.vue
│  ├─ 📂 pages/                # Routing อัตโนมัติ
│  │  ├─ index.vue             # Home page
│  │  └─ loan-calculator.vue    # calculator page
│  ├─ 📂 stores/               # State Management (Pinia)
│  │  └─ loanCalculator.ts
│  └─ 📂 utils/                # Connect supabase
│     └─ supabaseClient.ts
├─ 📂 public/                  # Static files
├─ nuxt.config.ts           # Config Nuxt
├─ package.json
└─ tsconfig.json
```

## 🛠 การติดตั้ง (Installation)

### 🔹 **1. Clone โปรเจค**
```sh
git clone https://github.com/FlukeSikharinn/LoanCalculator.git
cd LoanCalculator
```

### 🔹 **2. ติดตั้ง Dependencies**
```sh
npm install
```

### 🔹 **4. รันโปรเจค**
```sh
npm run dev
```

##  🚀 Deployment
- Hosted on Vercel (🔗 https://loan-calculator-steel-one.vercel.app)

## 🏗 Tech Stack
- Stack: Nuxt.js, Tailwind CSS
- Database: Supabase
- Deployment: Vercel, CI/CD

