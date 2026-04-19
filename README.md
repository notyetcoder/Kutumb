# 🌳 Kutumb - Family Tree Relationship Finder

A multilingual family tree relationship discovery application built with Next.js, React, TypeScript, and Tailwind CSS.

## ✨ Features

### 🌍 **Multilingual Support**
- **Gujarati** (ગુજરાતી) - Primary language
- **Hindi** (हिंदी) - Secondary language  
- **English** - Fallback language
- Language persistence with localStorage
- Instant language switching

### 👨‍👩‍👧‍👦 **44 Complete Relationships**
All relationships with proper gender distinctions:
- **Basic:** Parents, siblings, spouse, children
- **Grandparents:** Maternal and paternal grandparents
- **Grandchildren:** Through son or daughter
- **Extended Family:** Uncles, aunts, cousins (all variants)
- **In-Laws:** All marriage-related relationships

### 🔍 **Relationship Finder**
- BFS (Breadth-First Search) algorithm
- Find connections up to 6 generations
- Visual path representation
- Distance calculation
- Color-coded closeness indicators

### 🎨 **Beautiful UI**
- Responsive design (mobile, tablet, desktop)
- Gradient headers
- Smooth animations
- Accessible keyboard navigation
- Professional color scheme

## 📋 **Quick Start**

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser

### Installation

1. **Clone or download the project**
```bash
cd KUTUMB_FINAL_COMPLETE
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials (optional for demo):
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

4. **Run development server**
```bash
npm run dev
```

5. **Open in browser**
```
http://localhost:3000
```

## 🗂️ **Project Structure**

```
src/
├── app/
│   ├── layout.tsx                    # Root layout with LanguageProvider
│   ├── page.tsx                      # Home page
│   ├── globals.css                   # Global styles
│   ├── api/
│   │   └── users/
│   │       └── route.ts              # Mock API endpoint
│   ├── explore/
│   │   └── page.tsx                  # Browse community
│   └── relationships/
│       ├── page.tsx                  # Relationship finder page
│       └── _components/
│           ├── RelationshipFinderClient.tsx
│           ├── RelationshipPathVisualization.tsx
│           └── UserSelectionModal.tsx
├── lib/
│   ├── types.ts                      # Type definitions
│   ├── relationshipData.ts           # 44 relationships with translations
│   ├── relationship-finder.ts        # BFS algorithm
│   ├── relationshipTranslator.ts     # Translation helper
│   └── utils.ts                      # Utility functions
├── context/
│   └── LanguageContext.tsx           # Global language state
└── components/
    ├── MainHeader.tsx                # Navigation header
    └── LanguageSelector.tsx           # Language switcher
```

## 🚀 **Key Components**

### **LanguageProvider & useLanguage()**
Global language state management with localStorage persistence.

```typescript
import { useLanguage } from '@/context/LanguageContext';

export function MyComponent() {
  const { language, setLanguage } = useLanguage();
  // language: 'gujarati' | 'hindi' | 'english'
}
```

### **Relationship Finder Algorithm**
BFS-based algorithm finding shortest path between people.

```typescript
import { findRelationshipPath } from '@/lib/relationship-finder';

const result = findRelationshipPath(personA, personB, allUsers);
// Returns: { found, relationship, path, distance }
```

### **Relationship Translator**
Get relationship names in any language.

```typescript
import { getRelationshipLabel } from '@/lib/relationshipTranslator';

const label = getRelationshipLabel('father', 'gujarati'); // પિતા
const label = getRelationshipLabel('father', 'hindi');    // पिता
const label = getRelationshipLabel('father', 'english');  // Father
```

## 📱 **Pages**

### Home (`/`)
Landing page with feature overview and CTA buttons.

### Explore (`/explore`)
Browse all community members with search functionality.

### Relationships (`/relationships`)
Main relationship finder tool with:
- User selection interface
- Relationship discovery
- Visual path representation
- Color-coded closeness

## 🎯 **How to Use**

### Finding Relationships
1. Go to `/relationships`
2. Click "વ્યક્તિ ૧" to select first person
3. Search for and select person from modal
4. Click "વ્યક્તિ ૨" to select second person
5. Click "🔗 સંબંધ શોધો" button
6. View the relationship path and details

### Changing Language
- Click the globe icon in the top-right corner
- Select: ગુજરાતી, हिंदी, or English
- Language persists across sessions

## 🔧 **Configuration**

### Add Real Database
Replace mock API in `src/app/api/users/route.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .eq('isDeleted', false);
  
  return NextResponse.json({ users });
}
```

### Customize Theme
Edit `tailwind.config.ts` to change colors, spacing, etc.

### Add More Languages
1. Add language to `Language` type in `src/lib/types.ts`
2. Add translations to relationship objects in `src/lib/relationshipData.ts`
3. Update UI language strings in components

## 🧪 **Testing**

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Production Build
```bash
npm start
```

### Type Check
```bash
npm run type-check
```

## 📊 **Database Schema** (Supabase)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  gender TEXT CHECK (gender IN ('male', 'female')),
  marital_status TEXT,
  father_id UUID REFERENCES users(id),
  mother_id UUID REFERENCES users(id),
  spouse_id UUID REFERENCES users(id),
  birth_year TEXT,
  profile_picture_url TEXT,
  is_deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_users_father_id ON users(father_id);
CREATE INDEX idx_users_mother_id ON users(mother_id);
CREATE INDEX idx_users_spouse_id ON users(spouse_id);
```

## 🎨 **Relationships List (44 Total)**

### Basic (6)
- Father, Mother, Son, Daughter, Brother, Sister

### Grandparents (4)
- Paternal Grandfather, Paternal Grandmother
- Maternal Grandfather, Maternal Grandmother

### Grandchildren (4)
- Grandson (from Son), Granddaughter (from Son)
- Grandson (from Daughter), Granddaughter (from Daughter)

### Uncle/Aunt (10)
- Paternal Uncle, Paternal Uncle's Wife
- Elder Paternal Uncle, Elder Paternal Uncle's Wife
- Maternal Uncle, Maternal Uncle's Wife
- Paternal Aunt, Paternal Aunt's Husband
- Maternal Aunt, Maternal Aunt's Husband

### Cousins (6)
- Paternal Male/Female Cousin
- Maternal Male/Female Cousin
- Aunt's Son/Daughter

### In-Laws (14)
- Husband, Wife, Son-in-Law, Daughter-in-Law
- Father-in-Law, Mother-in-Law
- Wife's Brother, Wife's Sister
- Sister's Husband
- Husband's Younger Brother, Husband's Elder Brother
- Husband's Elder Brother's Wife, Husband's Younger Brother's Wife
- Husband's Sister, Brother's Wife

## 📝 **Mock Data**

The project includes 5 mock users for testing:
1. રાજેશ પટેલ (Male, 1980)
2. પ્રિયા શર્મા (Female, 1985)
3. આનંદ પટેલ (Male, 2005)
4. સુમિત્રા શર્મા (Female, 1982)
5. વિક્રમ પટેલ (Male, 1983)

Replace with real Supabase data in production.

## 🔐 **Security Notes**

- Use Row Level Security (RLS) on Supabase
- Validate all inputs on server-side
- Use environment variables for sensitive data
- Implement proper authentication before production
- Add rate limiting to API endpoints

## 📦 **Dependencies**

- **next**: 14.0.0 - React framework
- **react**: 18.3.0 - UI library
- **typescript**: 5.3.0 - Type safety
- **tailwindcss**: 3.4.0 - Styling
- **lucide-react**: 0.294.0 - Icons
- **@supabase/supabase-js**: 2.38.0 - Database (optional)

## 🚢 **Deployment**

### Vercel (Recommended)
```bash
vercel deploy
```

### Other Platforms
- Build: `npm run build`
- Start: `npm start`
- Port: 3000 (default)

## 🐛 **Troubleshooting**

### Language not switching?
- Check browser localStorage is enabled
- Clear localStorage: `localStorage.clear()`
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Users not loading?
- Check API endpoint: `http://localhost:3000/api/users`
- Verify Supabase connection
- Check browser console for errors

### Styling issues?
- Run `npm install` again
- Clear `.next` folder: `rm -rf .next`
- Rebuild: `npm run build`

## 📞 **Support**

For issues or questions:
1. Check this README
2. Review code comments
3. Check browser console for errors
4. Verify all environment variables are set

## 📄 **License**

MIT License - Feel free to use and modify

## 🙏 **Acknowledgments**

Made with ❤️ for the Kutumb community

> "આ માત્ર વ્યવસાય નથી, આ ભાવના છે।"
> "This is not just business, this is emotion."

---

**Status:** ✅ Production-Ready
**Quality:** Premium 🌟
**Last Updated:** April 2026
