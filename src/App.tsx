import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PawPrint,
  Heart,
  Info,
  BookOpen,
  Users,
  MapPin,
  Phone,
  Mail,
  Filter,
  CheckCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Facebook,
  Instagram,
  Send,
  Award,
  AlertCircle,
  HeartHandshake,
  ExternalLink,
  Share2
} from 'lucide-react';
import { DOGS, SHELTERS, SUCCESS_STORIES, ARTICLES, FAQS, TEAM_MEMBERS, IMAGES, STATISTICS } from './data';
import { Dog, Article, Shelter } from './types';

export default function App() {
  // Navigation active tab index (0=Home/About, 1=Care Articles, 2=Adoption, 3=Success Stories, 4=Contact/FAQ)
  const [activeTab, setActiveTab] = useState<string>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  
  // Articles Category Filter
  const [articleFilter, setArticleFilter] = useState<string>('ყველა');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Adoption Filters
  const [dogSizeFilter, setDogSizeFilter] = useState<string>('ყველა');
  const [dogGenderFilter, setDogGenderFilter] = useState<string>('ყველა');
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null);
  
  // FAQs Accordion State (saves mapping of faq ID to open index)
  const [openFaqs, setOpenFaqs] = useState<Record<string, boolean>>({});

  // Contact Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'გაშვილება',
    message: '',
    dogId: '',
  });
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Quick link helper to shift tab and optionally focus scroll
  const handleNavigateToTab = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFaqToggle = (id: string) => {
    setOpenFaqs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Save to localStorage representing real persistence
      const savedSubmissions = JSON.parse(localStorage.getItem('campaign_submissions') || '[]');
      savedSubmissions.push({
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('campaign_submissions', JSON.stringify(savedSubmissions));
      
      setSubmitting(false);
      setFormSubmitted(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'გაშვილება',
        message: '',
        dogId: '',
      });
    }, 1200);
  };

  const handleDogInquiry = (dog: Dog) => {
    setFormData((prev) => ({
      ...prev,
      subject: 'გაშვილება',
      dogId: dog.id,
      message: `გამარჯობა, ძალიან მომეწონა ძაღლი სახელით ${dog.name} (${dog.id}). მსურს მეტი გავიგო მისი აყვანის პროცესის შესახებ.`
    }));
    setSelectedDog(null); // Close dog modal
    setActiveTab('contact'); // Move to contact tab
    // Wait slightly to let browser transition then scroll to form
    setTimeout(() => {
      document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  // Filtered lists
  const filteredArticles = articleFilter === 'ყველა'
    ? ARTICLES
    : ARTICLES.filter(art => art.category === articleFilter);

  const filteredDogs = DOGS.filter(dog => {
    const matchesSize = dogSizeFilter === 'ყველა' || dog.size === dogSizeFilter;
    const matchesGender = dogGenderFilter === 'ყველა' || dog.gender === dogGenderFilter;
    return matchesSize && matchesGender;
  });

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-blue-500 selection:text-white bg-[#f1f5f9]">
      
      {/* 1. HEADER / NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md text-slate-800 shadow-sm border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo area */}
            <div 
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => handleNavigateToTab('home')}
              id="header-logo"
            >
              <div className="bg-[#1877F2] text-white p-2.5 rounded-2xl transition-transform duration-300 group-hover:scale-105 shadow-sm">
                <PawPrint className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 block">გადაარჩინე მეგობარი</span>
                <span className="text-xs text-[#1877F2] block uppercase tracking-widest font-semibold font-mono">საინფორმაციო კამპანია</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1 lg:space-x-2">
              <button
                id="dekstop-nav-home"
                onClick={() => handleNavigateToTab('home')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'home' 
                    ? 'bg-[#1877F2] text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                მთავარი
              </button>
              <button
                id="dekstop-nav-care"
                onClick={() => handleNavigateToTab('care')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'care' 
                    ? 'bg-[#1877F2] text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                ძაღლების შესახებ
              </button>
              <button
                id="dekstop-nav-adoption"
                onClick={() => handleNavigateToTab('adoption')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'adoption' 
                    ? 'bg-[#1877F2] text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                გაშვილება
              </button>
              <button
                id="dekstop-nav-success"
                onClick={() => handleNavigateToTab('success')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'success' 
                    ? 'bg-[#1877F2] text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                წარმატების ისტორიები
              </button>
              <button
                id="dekstop-nav-contact"
                onClick={() => handleNavigateToTab('contact')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === 'contact' 
                    ? 'bg-[#1877F2] text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                კონტაქტი & დახმარება
              </button>
            </nav>

            {/* Mobile menu trigger */}
            <div className="md:hidden">
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-3.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition-colors border border-slate-200"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-drawer"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-slate-200 overflow-hidden"
            >
              <div className="px-3 pt-3 pb-6 space-y-2">
                <button
                  id="mobile-nav-home"
                  onClick={() => handleNavigateToTab('home')}
                  className={`block w-full text-left px-4 py-3.5 rounded-xl text-base font-semibold transition-colors ${
                    activeTab === 'home' ? 'bg-[#1877F2] text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  მთავარი
                </button>
                <button
                  id="mobile-nav-care"
                  onClick={() => handleNavigateToTab('care')}
                  className={`block w-full text-left px-4 py-3.5 rounded-xl text-base font-semibold transition-colors ${
                    activeTab === 'care' ? 'bg-[#1877F2] text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  ძაღლების შესახებ
                </button>
                <button
                  id="mobile-nav-adoption"
                  onClick={() => handleNavigateToTab('adoption')}
                  className={`block w-full text-left px-4 py-3.5 rounded-xl text-base font-semibold transition-colors ${
                    activeTab === 'adoption' ? 'bg-[#1877F2] text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  გაშვილება
                </button>
                <button
                  id="mobile-nav-success"
                  onClick={() => handleNavigateToTab('success')}
                  className={`block w-full text-left px-4 py-3.5 rounded-xl text-base font-semibold transition-colors ${
                    activeTab === 'success' ? 'bg-[#1877F2] text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  წარმატების ისტორიები
                </button>
                <button
                  id="mobile-nav-contact"
                  onClick={() => handleNavigateToTab('contact')}
                  className={`block w-full text-left px-4 py-3.5 rounded-xl text-base font-semibold transition-colors ${
                    activeTab === 'contact' ? 'bg-[#1877F2] text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  კონტაქტი & დახმარება
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* MAIN LAYOUT WRAPPER */}
      <main className="flex-grow">
        
        {/* TAB 1: HOME PAGE (მთავარი და ჩვენ შესახებ) */}
        {activeTab === 'home' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-12 pb-20 pt-6"
          >
            {/* Hero / Banner Segment as a massive Bento block */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white rounded-[2rem] p-8 md:p-14 shadow-lg border border-slate-200/10">
                <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay"></div>
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Hero texts */}
                  <div className="lg:col-span-7 space-y-6 text-left">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono tracking-wider">
                      ★ საზოგადოებრივი ინიციატივა
                    </span>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                      ერთად შევცვალოთ <span className="text-orange-500">მიუსაფარი მეგობრების ბედი</span> საქართველოში
                    </h1>
                    <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
                      საქართველოს ქუჩებში ათასობით უპატრონო ძაღლი ცხოვრობს. ჩვენი კამპანიის მიზანია საზოგადოების სწორი ინფორმირება, პასუხისმგებლიანი მეპატრონეობის პოპულარიზაცია და თითოეული მეგობრისთვის თბილი თავშესაფრის პოვნა.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <button
                        onClick={() => handleNavigateToTab('adoption')}
                        className="bg-[#1877F2] hover:bg-blue-600 hover:scale-[1.02] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md hover:shadow-lg text-center cursor-pointer flex items-center justify-center space-x-2"
                      >
                        <Heart className="w-5 h-5 fill-current" />
                        <span>აიყვანე ძაღლი თავშესაფრიდან</span>
                      </button>
                      <button
                        onClick={() => handleNavigateToTab('care')}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 px-8 py-4 rounded-xl font-bold transition-all text-center cursor-pointer flex items-center justify-center space-x-2"
                      >
                        <BookOpen className="w-5 h-5" />
                        <span>როგორ მოვუაროთ სწორად?</span>
                      </button>
                    </div>
                  </div>

                  {/* Hero Graphic element */}
                  <div className="lg:col-span-5 flex justify-center">
                    <div className="relative group p-4 bg-slate-800/80 rounded-3xl border border-slate-700/65 shadow-2xl overflow-hidden w-full max-w-md">
                      <img
                        src={IMAGES.hero}
                        alt="Heartwarming rescued stray dog"
                        className="rounded-2xl w-full object-cover aspect-[4/3] shadow-md border border-white/5 transition-transform duration-500 group-hover:scale-[1.02]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-6 left-6 right-6 bg-slate-950/90 backdrop-blur-md rounded-xl p-4 border border-white/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-white text-base">ბუბუ</h4>
                            <p className="text-xs text-slate-400">წარმატებით გაშვილებული მეგობარი</p>
                          </div>
                          <span className="bg-orange-500 text-white text-xs px-2.5 py-1 rounded-lg font-bold">გადარჩენილია</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* Campaign Core Mission Cards */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
                <span className="text-xs font-bold tracking-wider uppercase text-[#1877F2] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100 font-mono">ჩვენი მისია</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 pt-2">კამპანიის ძირითადი მიზნები</h2>
                <p className="text-slate-600 text-lg">
                  ჩვენ გვჯერა, რომ სწორი განათლება და თანაგრძნობა ცხოვრობს თითოეულ ქართველში. აი ოთხი მიმართულება, რომლითაც ვცვლით რეალობას:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md hover:scale-[1.02] hover:border-orange-200 transition-all duration-300 space-y-5">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shadow-inner">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">საზოგადოების განათლება</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    ქუჩის ძაღლები არ არიან საშიშნი, თუ მათ სწორად ვეპყრობით. ძალადობისა და შიშის წინააღმდეგ განათლება საუკეთესო წამალია.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md hover:scale-[1.02] hover:border-blue-200 transition-all duration-300 space-y-5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">საპასუხისმგებლო მეპატრონეობა</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    ძაღლის აყვანა ნიშნავს მის რეგისტრაციას, დროულ ვაქცინაციას, სტერილიზაციას და ქუჩაში არმიტოვებას.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md hover:scale-[1.02] hover:border-emerald-200 transition-all duration-300 space-y-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                    <Info className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">თავშესაფრების მხარდაჭერა</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    აქტიური ინფორმაციის გავრცელება კერძო და სახელმწიფო თავშესაფრებზე, რათა მოსახლეობამ იცოდეს სად იპოვოს ძაღლი.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md hover:scale-[1.02] hover:border-rose-200 transition-all duration-300 space-y-5">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-inner">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">გაშვილების წახალისება</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    „ნუ იყიდი - აიყვანე ქუჩიდან“. ქუჩიდან ან თავშესაფრიდან აყვანილი ძაღლები განსაკუთრებულ სიყვარულს გამოხატავენ.
                  </p>
                </div>

              </div>
            </section>

            {/* Campaign Statistics Segment as individual Bento Cards */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {STATISTICS.map((stat) => (
                  <div 
                    key={stat.id} 
                    className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md hover:scale-[1.01] hover:border-blue-100 transition-all duration-300 text-center space-y-3"
                  >
                    <div className="text-4xl lg:text-5xl font-extrabold text-[#1877F2] font-mono tracking-tight">
                      {stat.value}
                    </div>
                    <div className="font-bold text-slate-850 text-base">{stat.label}</div>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                      {stat.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* "ჩვენ შესახებ" (About Us & Campaign Authors) Section */}
            <section id="about-us-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
              <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200/80 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  <div className="lg:col-span-7 space-y-6">
                    <div className="inline-flex items-center space-x-2 text-blue-700 font-semibold text-sm">
                      <HeartHandshake className="w-5 h-5 text-[#1877F2]" />
                      <span>ვის მიერ ხორციელდება პროექტი?</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900">ჩვენ შესახებ</h2>
                    <p className="text-slate-700 leading-relaxed text-base">
                      ეს საინფორმაციო კამპანია არის მოხალისეობრივი და სოციალური პროექტი, რომელიც მიზნად ისახავს უსახლკარო ცხოველთა რეალურ დაცვას და პასუხისმგებლიანი საზოგადოების გაძლიერებას საქართველოში. ჩვენ ვართ სამი უბრალო სტუდენტი გოგონა (მე, ნინი ავანაშვილი და ნინი ბეგლარიშვილი), რომლებიც სრულად იაზრებენ ამ პრობლემის სერიოზულობასა და სიმძიმეს საქართველოში, განსაკუთრებით ბოლო პერიოდში.
                    </p>
                    <p className="text-slate-700 leading-relaxed text-base">
                      ჩვენ გვინდა რაც შეიძლება მეტი გავაკეთოთ ჩვენი ოთხფეხა მეგობრების დასახმარებლად და გავზარდოთ საზოგადოებრივი პასუხისმგებლობა. ამისათვის მჭიდროდ ვთანამშრომლობთ ადგილობრივ თავშესაფრებთან, რათა ხელი შევუწყოთ მათ პოპულარიზაციას და დავეხმაროთ ძაღლებს თბილი ოჯახების პოვნაში.
                    </p>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="bg-slate-50 rounded-3xl p-8 shadow-inner border border-slate-200/60 space-y-4">
                      <h4 className="font-extrabold text-slate-900 border-b border-slate-200 pb-3">პროექტის პრინციპები:</h4>
                      <ul className="space-y-4">
                        <li className="flex items-start space-x-3 text-sm text-slate-600">
                          <CheckCircle className="w-5 h-5 text-[#1877F2] mt-0.5 shrink-0" />
                          <span><strong>საჯაროობა</strong> — ყველა თავშესაფრისა და ძაღლის ინფორმაცია უფასო და ხელმისაწვდომია.</span>
                        </li>
                        <li className="flex items-start space-x-3 text-sm text-slate-600">
                          <CheckCircle className="w-5 h-5 text-[#1877F2] mt-0.5 shrink-0" />
                          <span><strong>მზრუნველობა</strong> — ძაღლების გაშვილებისას მკაცრად ვამოწმებთ მომავალ გარემოს.</span>
                        </li>
                        <li className="flex items-start space-x-3 text-sm text-slate-600">
                          <CheckCircle className="w-5 h-5 text-[#1877F2] mt-0.5 shrink-0" />
                          <span><strong>ჰუმანურობა</strong> — ჩვენ მხარს ვუჭერთ მხოლოდ ჰუმანურ და არააკრძალულ მეთოდებს პოპულაციის სამართავად.</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                </div>

                {/* Team Grid */}
                <div className="mt-16 border-t border-slate-200 pt-12">
                  <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center space-x-2">
                    <Users className="w-5 h-5 text-[#1877F2]" />
                    <span>ორგანიზატორები და ავტორები</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TEAM_MEMBERS.map((member) => (
                      <div key={member.id} className="bg-slate-50/55 hover:bg-slate-50 rounded-3xl p-6.5 border border-slate-200/50 shadow-sm hover:scale-[1.02] hover:border-slate-300 hover:shadow-md transition-all duration-300 space-y-3">
                        <div>
                          <h4 className="font-bold text-slate-900 text-lg">{member.name}</h4>
                          <p className="text-xs font-semibold text-[#1877F2] font-mono tracking-wider">{member.role}</p>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          {member.bio}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </section>

            {/* Quick action banner */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-blue-600 via-[#1877F2] to-indigo-600 text-white rounded-[2rem] p-8 md:p-12 text-center space-y-6 relative overflow-hidden shadow-lg border border-blue-900/10">
                <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-blue-500 rounded-full opacity-25 blur-2xl"></div>
                
                <h2 className="text-2xl md:text-3xl font-extrabold max-w-2xl mx-auto">
                  მზად ხარ გახდე გმირი და გადაარჩინო ერთი პატარა ცხოვრება?
                </h2>
                <p className="text-blue-100 max-w-lg mx-auto">
                  ჩვენი თავშესაფრები სავსეა მოსიყვარულე ძაღლებით, რომლებიც მოუთმენლად ელიან შენს გამოჩენას.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => handleNavigateToTab('adoption')}
                    className="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 hover:scale-[1.02] transition-all cursor-pointer shadow-md text-base"
                  >
                    შეარჩიე ძაღლი
                  </button>
                </div>
              </div>
            </section>

          </motion.div>
        )}

        {/* TAB 2: ARTICLES ABOUT DOGS (ძაღლების შესახებ) */}
        {activeTab === 'care' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12"
          >
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs font-bold tracking-wider uppercase text-[#1877F2] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100 font-mono">საგანმანათლებლო პორტალი</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 pt-2">რეკომენდაციები და მოვლა</h2>
              <p className="text-slate-600">
                სწორი მოვლა და ცოდნა არის ჯანმრთელი ცხოველისა და უსაფრთხო გარემოს საწინდარი. გაეცანით ჩვენს სტატიებსა და რეკომენდაციებს:
              </p>
            </div>

            {/* Category selection */}
            <div className="flex flex-wrap justify-center gap-2 border-b border-slate-200/80 pb-6">
              {['ყველა', 'მოვლა', 'კვება', 'ვეტერინარია', 'კანონმდებლობა'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setArticleFilter(cat)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    articleFilter === cat
                      ? 'bg-[#1877F2] text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-50 shadow-sm border border-slate-200/80'
                  }`}
                >
                  {cat === 'ყველა' ? 'ყველა კატეგორია' : cat}
                </button>
              ))}
            </div>

            {/* List of articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredArticles.map((article) => (
                <div 
                  key={article.id}
                  className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md hover:scale-[1.01] hover:border-blue-200 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-600 uppercase font-mono tracking-wider">
                        {article.category}
                      </span>
                      <span className="text-xs text-slate-450 font-mono flex items-center space-x-1">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        <span>{article.readTime}</span>
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setSelectedArticle(article)}>
                      {article.title}
                    </h3>
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-100 mt-6 flex justify-between items-center">
                    <button
                      onClick={() => setSelectedArticle(article)}
                      className="text-blue-600 font-bold hover:text-blue-700 transition-colors inline-flex items-center space-x-1 bg-blue-50/80 hover:bg-blue-100/80 px-4.5 py-2.5 rounded-xl cursor-pointer text-sm"
                    >
                      <span>გაგრძელება</span>
                    </button>
                    <button
                      onClick={() => {
                        alert('კამპანიის საინფორმაციო ბმული კოპირებულია თქვენს ბუფერში!');
                      }}
                      className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                      title="გაზიარება"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ARTICLE MODAL DEEP-DIVE */}
            <AnimatePresence>
              {selectedArticle && (
                <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedArticle(null)}
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
                  ></motion.div>

                  {/* Modal Body */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative bg-white rounded-[2rem] shadow-2xl max-w-3xl w-full p-6 md:p-10 overflow-hidden z-10 border border-slate-200"
                  >
                    {/* Header Controls */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
                      <div className="flex items-center space-x-3">
                        <span className="px-3.5 py-1 text-xs font-bold bg-blue-50 text-blue-600 rounded-lg font-mono">
                          {selectedArticle.category}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{selectedArticle.readTime}</span>
                      </div>
                      <button
                        onClick={() => setSelectedArticle(null)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-slate-400 hover:text-slate-900 border border-slate-200"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="prose max-w-none space-y-6">
                      <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                        {selectedArticle.title}
                      </h2>
                      
                      <div className="text-slate-700 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-sans">
                        {selectedArticle.content}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          setSelectedArticle(null);
                        }}
                        className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer text-sm transition-colors border border-slate-200"
                      >
                        დახურვა
                      </button>
                      <button
                        onClick={() => {
                          alert('ბმული შენახულია გასაზიარებლად!');
                        }}
                        className="px-6 py-3 bg-[#1877F2] hover:bg-blue-600 text-white rounded-xl font-bold cursor-pointer text-sm transition-colors flex items-center space-x-2"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>გაზიარება</span>
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </motion.div>
        )}

        {/* TAB 3: DOG ADOPTION GALLERY & SHELTERS (გაშვილება) */}
        {activeTab === 'adoption' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16"
          >
            {/* Introductory Section */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <span className="text-xs font-bold tracking-wider uppercase text-[#1877F2] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100 font-mono">გაშვილება</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 pt-2">იპოვე ერთგული მეგობარი</h2>
              <p className="text-slate-600 leading-relaxed text-base">
                აქ შეგიძლიათ იხილოთ ქართულ თავშესაფრებში და დროებით შემფარებლებთან მყოფი ძაღლები, რომლებიც ახალ თბილ ოჯახს ელიან. გამოიყენეთ ფილტრები თქვენი მეგობრის შესარჩევად.
              </p>
            </div>

            {/* Step-by-Step Procedure Guide */}
            <section className="bg-slate-50 rounded-[2rem] p-8 md:p-12 border border-slate-200/80 shadow-md">
              <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 text-center mb-8 flex items-center justify-center space-x-2">
                <HeartHandshake className="w-6 h-6 text-[#1877F2]" />
                <span>აყვანის მარტივი 4 ნაბიჯი</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                
                <div className="bg-white rounded-3xl p-6.5 border border-slate-200/80 shadow-sm relative space-y-4 hover:scale-[1.01] hover:shadow-md transition-all duration-300">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold font-mono shadow-md shadow-blue-500/20">1</div>
                  <h4 className="font-extrabold text-slate-900 pt-2">1. აარჩიე ძაღლი</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">დაათვალიერე სია, წაიკითხე მათი ხასიათი და აარჩიე რომელიც შენს ცხოვრებას შეესაბამება.</p>
                </div>

                <div className="bg-white rounded-3xl p-6.5 border border-slate-200/80 shadow-sm relative space-y-4 hover:scale-[1.01] hover:shadow-md transition-all duration-300">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold font-mono shadow-md shadow-blue-500/20">2</div>
                  <h4 className="font-extrabold text-slate-900 pt-2">2. შეავსე ფორმა</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">დააჭირე ძაღლის ბარათზე ღილაკს „მინდა აყვანა“ და გამოგვიგზავნე შენი საკონტაქტო მონაცემები.</p>
                </div>

                <div className="bg-white rounded-3xl p-6.5 border border-slate-200/80 shadow-sm relative space-y-4 hover:scale-[1.01] hover:shadow-md transition-all duration-300">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold font-mono shadow-md shadow-blue-500/20">3</div>
                  <h4 className="font-extrabold text-slate-900 pt-2">3. გაიარე გასაუბრება</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">ჩვენი წარმომადგენელი გეწვევათ ან დაგირეკავთ საინფორმაციო გასაუბრებისთვის და პირობების განსახილველად.</p>
                </div>

                <div className="bg-white rounded-3xl p-6.5 border border-slate-200/80 shadow-sm relative space-y-4 hover:scale-[1.01] hover:shadow-md transition-all duration-300">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold font-mono shadow-md shadow-blue-500/20">4</div>
                  <h4 className="font-extrabold text-slate-900 pt-2">4. წაიყვანე სახლში</h4>
                  <p className="text-slate-500 text-xs leading-relaxed">უფასოდ მოაწერე ხელი ხელშეკრულებას, და ჩაიხუტე შენი უერთგულესი ახალი ოჯახის წევრი ჩიპითა და პასპორტით.</p>
                </div>

              </div>
            </section>

            {/* Filter Section & Dogs Gallery */}
            <section className="space-y-8">
              
              <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center space-x-2.5 text-slate-950 font-extrabold">
                  <Filter className="w-5 h-5 text-[#1877F2]" />
                  <span>გაფილტრე მეგობრები:</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow md:max-w-2xl">
                  {/* Size Dropdown */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-slate-450 block uppercase tracking-wider font-mono">ზომა</label>
                    <div className="relative">
                      <select
                        value={dogSizeFilter}
                        onChange={(e) => setDogSizeFilter(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="ყველა">ყველა ზომა</option>
                        <option value="პატარა">პატარა (ბინისთვის)</option>
                        <option value="საშუალო">საშუალო</option>
                        <option value="დიდი">დიდი (ეზოსთვის)</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-450 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Gender Dropdown */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-slate-450 block uppercase tracking-wider font-mono">სქესი</label>
                    <div className="relative">
                      <select
                        value={dogGenderFilter}
                        onChange={(e) => setDogGenderFilter(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="ყველა">ორივე სქესი</option>
                        <option value="ხვადი">ხვადი (მამრი)</option>
                        <option value="ძუ">ძუ (მდედრი)</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-450 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Grid Results */}
              {filteredDogs.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-12 text-center border border-slate-200 max-w-lg mx-auto space-y-4 shadow-sm">
                  <AlertCircle className="w-12 h-12 text-orange-500 mx-auto" />
                  <h4 className="text-xl font-bold text-slate-900">ძაღლები ვერ მოიძებნა</h4>
                  <p className="text-slate-500 text-sm">მოცემული ფილტრების შესაბამისი ძაღლი ამჟამად არ არის ბაზაში. სცადეთ სხვა ფილტრების მითითება.</p>
                  <button
                    onClick={() => { setDogSizeFilter('ყველა'); setDogGenderFilter('ყველა'); }}
                    className="font-bold text-[#1877F2] hover:text-blue-750 underline text-sm transition-all"
                  >
                    ფილტრების გასუფთავება
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredDogs.map((dog) => (
                    <div 
                      key={dog.id} 
                      className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-250 hover:scale-[1.01] transition-all duration-300 flex flex-col group"
                    >
                      {/* Image cover */}
                      <div className="relative overflow-hidden aspect-[4/3] bg-slate-100">
                        <img
                          src={dog.image}
                          alt={dog.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 right-3 flex space-x-1.5">
                          <span className={`px-3 py-1 text-xs font-bold rounded-lg text-white font-mono shadow-sm ${
                            dog.gender === 'ხვადი' ? 'bg-[#1877F2]' : 'bg-rose-500'
                          }`}>
                            {dog.gender}
                          </span>
                        </div>
                      </div>

                      {/* Content block */}
                      <div className="p-5.5 flex-grow flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-extrabold text-slate-900 leading-tight">{dog.name}</h3>
                            <span className="text-slate-450 text-xs font-bold uppercase tracking-wider font-mono">{dog.age}</span>
                          </div>
                          
                          <div className="flex items-center text-xs text-slate-500 space-x-1 font-bold">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{dog.location}</span>
                            <span className="text-slate-300">•</span>
                            <span>ზომა: {dog.size}</span>
                          </div>

                          <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                            {dog.description}
                          </p>
                        </div>

                        {/* Traits tags */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {dog.traits.slice(0, 3).map((t, idx) => (
                            <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] uppercase font-extrabold px-2 py-1 rounded-md tracking-wider">
                              {t}
                            </span>
                          ))}
                        </div>

                        {/* Action buttons with 44px min target helper */}
                        <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                          <button
                            onClick={() => setSelectedDog(dog)}
                            className="text-slate-500 hover:text-slate-800 font-bold py-2.5 px-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors text-xs border border-transparent hover:border-slate-200"
                          >
                            დეტალურად
                          </button>
                          
                          <button
                            onClick={() => handleDogInquiry(dog)}
                            className="bg-[#1877F2] hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-transform hover:scale-[1.02] cursor-pointer flex items-center space-x-1 shadow-md shadow-blue-500/10"
                          >
                            <span>აყვანა</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* List of Shelters Directory */}
            <section className="border-t border-slate-200 pt-16 space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <h3 className="text-2xl font-extrabold text-slate-900 flex items-center justify-center space-x-2">
                  <BuildingIcon className="w-5 h-5 text-[#1877F2]" />
                  <span>სად ვიპოვოთ თავშესაფრები საქართველოში?</span>
                </h3>
                <p className="text-slate-600 text-sm">
                  თბილისსა და რეგიონებში ფუნქციონირებს რამდენიმე ძირითადი თავშესაფარი, სადაც ყოველდღიურად უვლიან ასობით გადარჩენილ ცხოველს. შეგიძლიათ მიაკითხოთ მათ პირადად.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SHELTERS.map((shelter) => (
                  <div key={shelter.id} className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-200 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between space-y-5">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 text-[10px] font-extrabold bg-slate-100 text-slate-700 uppercase rounded-md tracking-wider font-mono">
                          {shelter.badge}
                        </span>
                        <span className="text-xs text-blue-600 font-extrabold tracking-wide font-mono">{shelter.dogsCount} ბინადარი</span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-base leading-snug">{shelter.name}</h4>
                      <p className="text-slate-600 text-xs leading-relaxed">{shelter.description}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500 font-bold font-mono">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{shelter.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{shelter.contact}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* DEEP DETAILED DOG MODAL */}
            <AnimatePresence>
              {selectedDog && (
                <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedDog(null)}
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
                  ></motion.div>

                  {/* Modal Body */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative bg-white rounded-[2rem] shadow-2xl max-w-2xl w-full overflow-hidden z-10 border border-slate-200"
                  >
                    {/* Upper cover photo */}
                    <div className="relative h-64 md:h-80 bg-slate-100">
                      <img
                        src={selectedDog.image}
                        alt={selectedDog.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <button
                        onClick={() => setSelectedDog(null)}
                        className="p-2.5 bg-slate-900/40 backdrop-blur-md rounded-full text-white hover:bg-slate-950 hover:text-white transition-colors cursor-pointer absolute top-4 right-4 border border-white/20 shadow-lg"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                        <div className="bg-slate-950/85 backdrop-blur-md px-5 py-3 rounded-2xl text-white border border-white/5">
                          <h2 className="text-2xl font-black">{selectedDog.name}</h2>
                          <div className="flex items-center text-xs text-slate-300 space-x-2 mt-0.5">
                            <span>სქესი: {selectedDog.gender}</span>
                            <span>•</span>
                            <span>ასაკი: {selectedDog.age}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8 space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl text-slate-700 text-xs border border-slate-100 font-extrabold italic">
                        <div>
                          <span className="text-slate-40block pb-0.5 text-xs text-slate-400 not-italic">ზომა</span>
                          <span className="font-bold block text-slate-900 text-sm not-italic">{selectedDog.size}</span>
                        </div>
                        <div>
                          <span className="text-slate-40block pb-0.5 text-xs text-slate-400 not-italic">ბეწვის საფარი</span>
                          <span className="font-bold block text-slate-900 text-sm not-italic">{selectedDog.coat}</span>
                        </div>
                        <div>
                          <span className="text-slate-40block pb-0.5 text-xs text-slate-400 not-italic">მდებარეობა</span>
                          <span className="font-bold block text-slate-900 text-sm not-italic">{selectedDog.location}</span>
                        </div>
                        <div>
                          <span className="text-slate-40block pb-0.5 text-xs text-slate-400 not-italic">სტატუსი</span>
                          <span className="font-bold block text-emerald-600 text-sm not-italic">ვაქცინირებული</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-900 text-base">ხასიათის მახასიათებლები:</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedDog.traits.map((t, idx) => (
                            <span key={idx} className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-xl font-mono">
                              ✓ {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-900 text-base">ჩვენი მეგობრის ისტორია:</h4>
                        <p className="text-slate-600 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                          {selectedDog.description}
                        </p>
                      </div>

                      {/* Footer adoption triggers */}
                      <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-400">თავშესაფარი ID: {selectedDog.shelterId}</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedDog(null)}
                            className="px-5 py-3 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-bold cursor-pointer transition-colors"
                          >
                            გაუქმება
                          </button>
                          <button
                            onClick={() => handleDogInquiry(selectedDog)}
                            className="px-6 py-3 bg-[#1877F2] hover:bg-blue-600 text-white rounded-xl text-sm font-bold cursor-pointer transition-transform hover:scale-[1.02] flex items-center space-x-1.5 shadow-md shadow-blue-500/10"
                          >
                            <Heart className="w-4 h-4 fill-current" />
                            <span>ჩემი სურვილია აყვანა</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </motion.div>
        )}

        {/* TAB 4: SUCCESS STORIES (წარმატების ისტორიები) */}
        {activeTab === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16"
          >
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900">გადარჩენილი ბედნიერება</h2>
              <p className="text-stone-600 text-lg leading-relaxed">
                მიუსაფარი ცხოველების აყვანა ნიშნავს მისცე მათ მეორე შანსი. გაეცანით რეალურ ისტორიებს, რომლებიც შთააგონებს ასობით ადამიანს:
              </p>
            </div>

            {/* Testimonials Segment */}
            <div className="space-y-12">
              {SUCCESS_STORIES.map((story, index) => (
                <div 
                  key={story.id} 
                  className={`bg-white rounded-3xl overflow-hidden border border-amber-100 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-0 items-center hover:shadow-md transition-shadow duration-300 ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Photo area with flex direction control based on index parity */}
                  <div className={`lg:col-span-5 h-80 md:h-96 lg:h-full min-h-[350px] relative bg-stone-100 ${
                    index % 2 === 1 ? 'lg:order-last' : ''
                  }`}>
                    <img
                      src={story.image}
                      alt={story.dogName}
                      className="w-full h-full object-cover absolute inset-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-amber-500 text-stone-950 px-3.5 py-1 text-xs font-bold rounded-lg uppercase tracking-wide">
                      წარმატებით გაშვილდა
                    </div>
                  </div>

                  {/* Content area */}
                  <div className="lg:col-span-7 p-8 md:p-12 space-y-6 text-left">
                    <span className="text-xs font-semibold text-stone-400 font-mono flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{story.date}</span>
                    </span>
                    
                    <h3 className="text-2xl md:text-3xl font-extrabold text-stone-900">
                      ძაღლი {story.dogName} — {story.familyName}
                    </h3>
                    
                    <blockquote className="italic text-stone-700 text-base md:text-lg leading-relaxed relative border-l-4 border-amber-500 pl-4 bg-amber-50/40 py-3 rounded-r-xl">
                      {story.storyText}
                    </blockquote>

                    <p className="text-stone-500 text-sm leading-relaxed">
                      ეს პატარა ისტორია კიდევ ერთხელ ადასტურებს, რომ ქუჩის ცხოველები განსაკუთრებულად გრძნობენ ზრუნვას და თავიანთ თბილ გულს სხვების გასახარებლად ბოლომდე გვიხსნიან.
                    </p>

                    <div className="pt-2">
                      <button
                        onClick={() => handleNavigateToTab('adoption')}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm cursor-pointer inline-flex items-center space-x-1.5"
                      >
                        <PawPrint className="w-4 h-4" />
                        <span>მეც მინდა გადავარჩინო</span>
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Sharing statistics callout */}
            <div className="text-center bg-amber-50/60 rounded-3xl p-8 border border-amber-100 max-w-4xl mx-auto space-y-4">
              <h4 className="font-extrabold text-stone-950 text-xl">გაქვთ გადარჩენის საკუთარი ისტორია?</h4>
              <p className="text-stone-600 text-sm max-w-2xl mx-auto leading-relaxed">
                გაუზიარეთ თქვენი უპირობო სიყვარულის ამბავი სხვებსაც! გამოგვიგზავნეთ ფოტოები და მოკლე ტექსტი საკონტაქტო ფორმის საშუალებით და ჩვენ მას ჩვენს პლატფორმაზე განვათავსებთ.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => handleNavigateToTab('contact')}
                  className="bg-stone-900 hover:bg-stone-850 px-6 py-3 rounded-xl text-white text-sm font-bold hover:text-white cursor-pointer transition-colors"
                >
                  ისტორიის გამოგზავნა
                </button>
              </div>
            </div>

          </motion.div>
        )}

        {/* TAB 5: CONTACT & FAQ (კონტაქტი და დახმარება) */}
        {activeTab === 'contact' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16"
          >
            {/* Introductions */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900">კონტაქტი & დახმარება</h2>
              <p className="text-stone-600 text-base leading-relaxed">
                გაქვთ დამატებითი შეკითხვა, გსურთ მოხალისედ გახდომა, თუ გადაწყვიტეთ ძაღლის გაშვილება? მოგვწერეთ, ან გაეცანით ხშირად დასმულ შეკითხვებს.
              </p>
            </div>

            {/* VOLUNTEER CHANNELS */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm space-y-3 text-left">
                <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-stone-900 text-base">1. გახდი თავშესაფრის დამხმარე</h4>
                <p className="text-stone-600 text-xs leading-relaxed">მიესალმეთ და დაეხმარეთ ჩვენს თავშესაფრებს შაბათ-კვირას ძაღლების მოვლაში, დავარცხნაში და სეირნობაში.</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm space-y-3 text-left">
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-stone-900 text-base">2. დროებითი შემფარებელი</h4>
                <p className="text-stone-600 text-xs leading-relaxed">გახსენით თქვენი კარი დროებით, სანამ ლეკვისთვის ან ძაღლისთვის მუდმივ მზრუნველ ოჯახს ვიპოვით.</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm space-y-3 text-left">
                <div className="w-10 h-10 rounded-lg bg-yellow-105 bg-yellow-105/90 bg-amber-100 text-amber-800 flex items-center justify-center">
                  <PawPrint className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-stone-900 text-base">3. საინფორმაციო მხარდაჭერა</h4>
                <p className="text-stone-600 text-xs leading-relaxed">გამოიყენეთ თქვენი სოციალური ქსელები და დაეხმარეთ კამპანიას პლაკატების და ვიდეოების გავრცელებაში.</p>
              </div>

            </section>

            {/* Split Grid: Accordion FAQ and Contact Form */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* FAQ Accordions Accumulator */}
              <div className="lg:col-span-6 space-y-6 text-left">
                <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold text-stone-900">ხშირად დასმული კითხვები</h3>
                  <p className="text-stone-500 text-sm">პასუხები ყველაზე მწვავე და ხშირ შეკითხვებზე, რაც მიუსაფარ ცხოველებს ეხება:</p>
                </div>

                <div className="space-y-4">
                  {FAQS.map((faq) => {
                    const isOpen = !!openFaqs[faq.id];
                    return (
                      <div 
                        key={faq.id} 
                        className="bg-white rounded-2xl border border-amber-100 overflow-hidden shadow-sm transition-all"
                      >
                        <button
                          onClick={() => handleFaqToggle(faq.id)}
                          className="w-full text-left p-4.5 md:p-5 flex items-center justify-between font-bold text-stone-900 hover:bg-amber-50/20 cursor-pointer text-sm md:text-base leading-snug"
                        >
                          <span>{faq.question}</span>
                          {isOpen ? <ChevronUp className="w-5 h-5 text-amber-600 shrink-0 ml-3" /> : <ChevronDown className="w-5 h-5 text-stone-400 shrink-0 ml-3" />}
                        </button>
                        
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="border-t border-stone-50 bg-stone-50/50"
                            >
                              <p className="p-5 text-stone-600 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">
                                {faq.answer}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                {/* Left hand direct contacts */}
                <div className="bg-stone-900 text-white rounded-3xl p-6.5 border border-stone-800 space-y-4 mt-6">
                  <h4 className="font-bold text-white text-base">საკონტაქტო რეკვიზიტები</h4>
                  <p className="text-xs text-stone-400">თქვენ შეგიძლიათ დაგვიკავშირდეთ უშუალოდ მითითებულ ელ-ფოსტაზე ან მობილურზე:</p>
                  
                  <div className="space-y-3.5 text-xs text-stone-300 pt-2 font-mono">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-amber-500" />
                      <span>info@saveafriend.ge</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-amber-500" />
                      <span>+995 (599) 12 34 56</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-amber-500" />
                      <span className="font-sans">თბილისი, საქართველო</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* High-fidelity Contact Form */}
              <div id="contact-form" className="lg:col-span-6 bg-white rounded-3xl p-6 md:p-10 border border-amber-100 shadow-sm text-left">
                <div className="space-y-2 mb-6">
                  <h3 className="text-2xl font-extrabold text-stone-900">მოგვწერეთ შეტყობინება</h3>
                  <p className="text-stone-500 text-sm">შეავსეთ მარტივი ფორმა და ჩვენი მოხალისე უმოკლეს დროში დაგიკავშირდებათ.</p>
                </div>

                {formSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 md:p-8 text-center space-y-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-150 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-bold text-emerald-900">შეტყობინება წარმატებით გაიგზავნა!</h4>
                    <p className="text-emerald-700 text-sm">
                      გმადლობთ ინტერესისა და მხარდაჭერისთვის. ჩვენი საინფორმაციო კამპანიის მოხალისე უახლოესი 12 საათის განმავლობაში დაგიკავშირდებათ მითითებულ კოორდინატებზე.
                    </p>
                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="bg-emerald-600 hover:bg-emerald-75 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      ახალი შეტყობინების გაგზავნა
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-600 block">სახელი, გვარი *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="ნუცა წიკლაური"
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none focus:bg-white"
                        />
                      </div>

                      {/* Phone input */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-stone-600 block">ტელეფონის ნომერი *</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="599 123 456"
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none focus:bg-white font-mono"
                        />
                      </div>
                    </div>

                    {/* Email input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-600 block">ელ-ფოსტა *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="example@gmail.com"
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none focus:bg-white font-mono"
                      />
                    </div>

                    {/* Subject dropdown */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-600 block">თემა *</label>
                      <div className="relative">
                        <select
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none appearance-none font-medium"
                        >
                          <option value="გაშვილება">ძაღლის აყვანა (გაშვილება)</option>
                          <option value="მოხალისეობა">მოხალისედ გახდომა</option>
                          <option value="რეკომენდაცია">სტატიის ან ისტორიის გამოგზავნა</option>
                          <option value="სხვა">სხვა შეკითხვა</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-stone-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* Message input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-600 block">თქვენი შეტყობინება *</label>
                      <textarea
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="მომწერეთ თქვენი სურვილი ან კითხვა ცხოველებთან დაკავშირებით..."
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none focus:bg-white"
                      ></textarea>
                    </div>

                    {/* Mandatory Submit button with 44px min target helper */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-450 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-colors cursor-pointer flex items-center justify-center space-x-2"
                    >
                      {submitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>იგზავნება...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>გაგზავნა</span>
                        </>
                      )}
                    </button>

                  </form>
                )}
              </div>

            </div>
          </motion.div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-stone-900 border-t border-stone-850 text-stone-100 pt-16 pb-8 text-left mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Primary presentation info */}
            <div className="md:col-span-5 space-y-4">
              <div className="flex items-center space-x-2.5">
                <div className="bg-amber-500 text-stone-950 p-2 rounded-xl">
                  <PawPrint className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold text-white">გადაარჩინე მეგობარი</span>
              </div>
              <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
                საქართველოს უსახლკარო ცხოველთა მხარდამჭერი ოფიციალური საინფორმაციო კამპანია. ჩვენი მიზანია დავიცვათ ქუჩის ცხოველების სიცოცხლე, გავზარდოთ პასუხისმგებლობა და ვიპოვოთ ახალი ოჯახები.
              </p>
              
              {/* Mandatory: High Visibility Social Network Links */}
              <div className="flex space-x-4 pt-1.5" id="footer-social-icons">
                <a
                  href="https://facebook.com/SaveAFriendGeorgia"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-stone-800 text-stone-300 hover:bg-amber-600 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-stone-75"
                  title="Facebook გვერდი"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com/SaveAFriendGeorgia"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-stone-800 text-stone-300 hover:bg-amber-600 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-stone-75"
                  title="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://youtube.org"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-stone-800 text-stone-300 hover:bg-amber-600 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-stone-75"
                  title="YouTube"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Middle Sitemap Column */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider font-mono">განყოფილებები</h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <button 
                    onClick={() => handleNavigateToTab('home')} 
                    className="text-stone-400 hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    მთავარი გვერდი
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigateToTab('care')} 
                    className="text-stone-400 hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    ძაღლების მოვლის წესები
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigateToTab('adoption')} 
                    className="text-stone-400 hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    ძაღლების გაშვილება
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigateToTab('success')} 
                    className="text-stone-400 hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    წარმატების ისტორიები
                  </button>
                </li>
              </ul>
            </div>

            {/* Technical Help Column */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider font-mono">საგანგებო კავშირი</h4>
              <p className="text-stone-400 text-xs leading-normal">
                თუ იპოვეთ დაშავებული ძაღლი ან გჭირდებათ მუნიციპალური თავშესაფრის ცხელი ხაზი:
              </p>
              <div className="bg-stone-800 rounded-2xl p-4 border border-stone-75 space-y-2 text-xs">
                <span className="text-amber-500 font-extrabold block">სააგენტოს ცხელი ხაზი:</span>
                <span className="font-bold text-white block text-sm font-mono tracking-wide">
                  +995 (32) 242 14 24
                </span>
                <span className="block text-[10px] text-stone-450">მუშაობს ყოველდღე, 24 საათის განმავლობაში</span>
              </div>
            </div>

          </div>

          {/* Low boundary Copyright segment */}
          <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row items-center justify-between text-stone-500 text-xs space-y-4 md:space-y-0">
            <div>
              &copy; {new Date().getFullYear()} გადაარჩინე მეგობარი. საინფორმაციო კამპანია. ყველა უფლება დაცულია.
            </div>
            <div className="flex space-x-6">
              <span className="cursor-pointer hover:text-stone-400">წესები და პირობები</span>
              <span>•</span>
              <span className="cursor-pointer hover:text-stone-400">კონფიდენციალურობა</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}

// Minimal local sub-components to prevent compile faults
function BuildingIcon(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M8 10h.01" />
      <path d="M16 10h.01" />
      <path d="M12 14h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M8 14h.01" />
      <path d="M16 14h.01" />
    </svg>
  );
}
