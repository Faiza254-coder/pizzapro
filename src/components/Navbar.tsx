import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  Phone, 
  Menu as MenuIcon, 
  X, 
  User, 
  QrCode, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Sparkles,
  Percent
} from 'lucide-react';
import { STORE_INFO, BRAND_ASSETS } from '../data/menuData';
import { MenuItem, UserProfile } from '../types';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAuth: () => void;
  onOpenScanner: () => void;
  onOpenAdmin: () => void;
  onOpenLoyalty: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  menuItems: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
  currentUser?: UserProfile | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartTotal,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAuth,
  onOpenScanner,
  onOpenAdmin,
  onOpenLoyalty,
  searchQuery,
  setSearchQuery,
  activeSection,
  setActiveSection,
  menuItems,
  onSelectItem,
  currentUser,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const filteredSearchSuggestions = searchQuery.trim()
    ? menuItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'deals', label: 'Deals' },
    { id: 'squad', label: '🍕 Pizza Pro Squad' },
    { id: 'categories', label: 'Categories' },
    { id: 'bestsellers', label: 'Best Sellers' },
    { id: 'packaging', label: 'Box Design' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'About' },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-zinc-200 shadow-sm transition-all duration-300">
      {/* Top Promotional Bar */}
      <div className="bg-zinc-950 text-white text-xs py-2 px-4 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-zinc-300 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5">
            <span className="inline-flex items-center gap-1.5 font-bold text-red-400 bg-red-950/80 px-2.5 py-0.5 rounded-full border border-red-800/50">
              <Percent className="w-3.5 h-3.5 animate-spin-slow text-amber-400" />
              <span>12 PM - 6 PM: 20% OFF ALL PIZZAS!</span>
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              <span>Open 12 PM - 2 AM</span>
            </span>
            <span className="hidden lg:inline-flex items-center gap-1 text-zinc-400">
              <MapPin className="w-3.5 h-3.5 text-zinc-500" />
              <span>Main Petroleum Hujra Road, Shergarh</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <a
              href={`tel:${STORE_INFO.phones[0]}`}
              className="flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{STORE_INFO.phones[0]}</span>
            </a>
            <button
              onClick={onOpenLoyalty}
              className="hidden sm:flex items-center gap-1 text-amber-400 hover:text-amber-300 transition-colors font-bold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pizza Pro Rewards</span>
            </button>
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-6">
          {/* Brand Logo & Slogan */}
          <div
            onClick={() => handleNavClick('home')}
            className="cursor-pointer flex items-center gap-2.5 shrink-0 group"
          >
            <img
              src={BRAND_ASSETS.logo}
              alt="Pizza Pro Official Logo"
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80';
              }}
              className="w-11 h-11 sm:w-12 sm:h-12 object-cover rounded-full border-2 border-red-600 shadow-md shadow-red-600/20 group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-xl sm:text-2xl font-black italic tracking-tight text-zinc-950 leading-none">
                  PIZZA <span className="text-red-600">PRO</span>
                </span>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500">
                Shergarh's Choice
              </span>
            </div>
          </div>

          {/* Desktop Right Column: Search + Actions on top, Nav Links on bottom */}
          <div className="hidden md:flex flex-1 flex-col gap-2 min-w-0">
            {/* Top Bar: Search Input + Action Icons */}
            <div className="flex items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search pizzas, burgers, deals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                    className="w-full pl-9 pr-4 py-1.5 text-xs bg-zinc-100/90 border border-zinc-200/90 rounded-full focus:outline-none focus:border-red-600 focus:bg-white focus:ring-2 focus:ring-red-600/20 transition-all font-medium placeholder:text-zinc-400"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Live Search Suggestions Dropdown */}
                {searchFocused && filteredSearchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-zinc-200 overflow-hidden z-50">
                    <div className="p-2 border-b border-zinc-100 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      Menu Results
                    </div>
                    {filteredSearchSuggestions.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          onSelectItem(item);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-3 p-2.5 hover:bg-red-50 cursor-pointer transition-colors border-b border-zinc-50 last:border-none"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80';
                          }}
                          className="w-10 h-10 object-cover rounded-lg shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-zinc-900 truncate">
                            {item.name}
                          </h4>
                          <p className="text-[11px] text-zinc-500 truncate">
                            {item.description}
                          </p>
                        </div>
                        <span className="text-xs font-extrabold text-red-600 whitespace-nowrap">
                          Rs {item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                {/* Barcode Scanner */}
                <button
                  onClick={onOpenScanner}
                  className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-950 transition-colors relative"
                  title="Scan Barcode / Track Order"
                >
                  <QrCode className="w-4 h-4" />
                </button>

                {/* Wishlist */}
                <button
                  onClick={onOpenWishlist}
                  className="p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-950 transition-colors relative"
                  title="Wishlist"
                >
                  <Heart className="w-4 h-4" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                {/* User Auth / Profile */}
                <button
                  onClick={onOpenAuth}
                  className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-950 transition-colors flex items-center gap-1.5"
                  title={currentUser ? `Account: ${currentUser.name}` : "User Account"}
                >
                  <User className="w-4 h-4 text-red-600" />
                  {currentUser ? (
                    <span className="text-xs font-bold text-zinc-900 max-w-[85px] truncate hidden sm:inline">
                      {currentUser.name.split(' ')[0]}
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-zinc-700 hidden sm:inline">
                      Account
                    </span>
                  )}
                </button>

                {/* Cart Button */}
                <button
                  onClick={onOpenCart}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-full font-bold shadow-md shadow-red-600/30 transition-all duration-300 hover:scale-105"
                >
                  <div className="relative">
                    <ShoppingBag className="w-4 h-4" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-zinc-950 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-extrabold tracking-wide">
                    Rs {cartTotal.toLocaleString()}
                  </span>
                </button>
              </div>
            </div>

            {/* Bottom Bar: Single Horizontal Navigation Menu */}
            <nav className="flex items-center gap-5 lg:gap-7 pt-1">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`text-xs font-black uppercase tracking-wider transition-colors py-1 relative whitespace-nowrap ${
                      isActive
                        ? 'text-red-600 font-black'
                        : 'text-zinc-800 hover:text-red-600'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Mobile Right Action Icons */}
          <div className="flex md:hidden items-center gap-1.5 sm:gap-2">
            {/* Barcode Scanner */}
            <button
              onClick={onOpenScanner}
              className="p-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors"
              title="Scan Barcode / Track Order"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              className="p-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors relative"
              title="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* User Auth / Profile Button */}
            <button
              onClick={onOpenAuth}
              className="px-2 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors flex items-center gap-1"
              title={currentUser ? `Account: ${currentUser.name}` : "User Account"}
            >
              <User className="w-4 h-4 text-red-600" />
              <span className="text-[11px] font-bold text-zinc-900 max-w-[65px] truncate">
                {currentUser ? currentUser.name.split(' ')[0] : 'Account'}
              </span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-2.5 py-1.5 rounded-full font-bold shadow-sm"
            >
              <div className="relative">
                <ShoppingBag className="w-3.5 h-3.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-zinc-950 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-extrabold">
                Rs {cartTotal.toLocaleString()}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden mt-2.5">
          <div className="relative">
            <input
              type="text"
              placeholder="Search pizzas, burgers, deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs bg-zinc-100 border border-zinc-200 rounded-full focus:outline-none focus:border-red-600"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          </div>
        </div>

        {/* Top Horizontal Navigation Bar (Visible at top on all screens) */}
        <div className="mt-2.5 pt-2 border-t border-zinc-100 overflow-x-auto whitespace-nowrap scrollbar-none">
          <nav className="flex items-center gap-4 sm:gap-6 lg:gap-7 text-xs font-black uppercase tracking-wider">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`py-1 relative whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-red-600 font-black'
                      : 'text-zinc-800 hover:text-red-600'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Left-Side Drawer Menu */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-zinc-950/60 backdrop-blur-xs z-50 md:hidden transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Left-Side Drawer */}
          <aside className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 flex flex-col shadow-2xl md:hidden overflow-hidden transition-transform duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-100 bg-zinc-950 text-white">
              <div className="flex items-center gap-2.5">
                <img
                  src={BRAND_ASSETS.logo}
                  alt="Pizza Pro Official Logo"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80';
                  }}
                  className="w-9 h-9 object-cover rounded-full border border-red-500"
                />
                <div className="flex flex-col">
                  <span className="text-base font-black italic tracking-tight">
                    PIZZA <span className="text-red-500">PRO</span>
                  </span>
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                    Shergarh Navigation
                  </span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 px-3 pb-2">
                Explore Sections
              </div>
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                      isActive
                        ? 'bg-red-50 text-red-600 border-l-4 border-red-600 font-extrabold'
                        : 'text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-red-600" />}
                  </button>
                );
              })}
            </div>

            {/* Drawer Footer Actions & Info */}
            <div className="p-4 border-t border-zinc-100 bg-zinc-50 space-y-3">
              <button
                onClick={() => {
                  onOpenLoyalty();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 font-black text-xs py-2.5 px-3 rounded-xl shadow-sm hover:from-amber-400 hover:to-amber-500 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Pizza Pro Rewards</span>
              </button>

              <div className="space-y-1.5 text-xs text-zinc-600 font-medium">
                <a
                  href={`tel:${STORE_INFO.phones[0]}`}
                  className="flex items-center gap-2 text-red-600 font-bold hover:underline"
                >
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <span>{STORE_INFO.phones[0]}</span>
                </a>
                <div className="flex items-center gap-2 text-zinc-500 text-[11px]">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>Open 12 PM – 2 AM</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-500 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">Main Petroleum Hujra Road, Shergarh</span>
                </div>
              </div>
            </div>
          </aside>
        </>
      )}
    </header>
  );
};
