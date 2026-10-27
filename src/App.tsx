import React, { useState, useMemo, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { Navbar } from './components/Navbar';
import { HeroSlider } from './components/HeroSlider';
import { CategoriesNav } from './components/CategoriesNav';
import { MenuGrid } from './components/MenuGrid';
import { DealsSection } from './components/DealsSection';
import { SquadSection } from './components/SquadSection';
import { PackagingSection } from './components/PackagingSection';
import { FoodGallery } from './components/FoodGallery';
import { KitchenSection } from './components/KitchenSection';
import { ReviewsSection } from './components/ReviewsSection';
import { FAQContactSection } from './components/FAQContactSection';
import { PaymentMethodsSection } from './components/PaymentMethodsSection';
import { MenuCardSection } from './components/MenuCardSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { BarcodeScannerModal } from './components/BarcodeScannerModal';
import { UserAuthModal } from './components/UserAuthModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { LoyaltyModal } from './components/LoyaltyModal';
import { ItemDetailsModal } from './components/ItemDetailsModal';
import { Chatbot } from './components/Chatbot';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

import { SEO } from './components/SEO';
import { MENU_ITEMS, STORE_INFO } from './data/menuData';
import { MenuItem, CategoryId, CartItem, Order, UserProfile, Coupon } from './types';
import { auth, onAuthStateChanged, getUserProfileFromFirestore, subscribeUserOrders } from './lib/firebase';

export function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Store States
  const [menuItemsList, setMenuItemsList] = useState<MenuItem[]>(MENU_ITEMS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [orderType, setOrderType] = useState<'delivery' | 'takeaway'>('delivery');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoyaltyOpen, setIsLoyaltyOpen] = useState(false);
  const [selectedModalItem, setSelectedModalItem] = useState<MenuItem | null>(null);

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile = await getUserProfileFromFirestore(user.uid);
        if (profile) {
          setCurrentUser(profile);
        } else {
          const newProfile: UserProfile = {
            id: user.uid,
            email: user.email || '',
            name: user.displayName || user.email?.split('@')[0] || 'Pizza Pro User',
            phone: '03251229333',
            loyaltyPoints: 100,
            savedAddresses: ['Shergarh, Punjab'],
          };
          setCurrentUser(newProfile);
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Firestore Real-time Orders Listener
  useEffect(() => {
    if (!currentUser?.id) {
      setUserOrders([]);
      return;
    }
    const unsubscribeOrders = subscribeUserOrders(currentUser.id, (firestoreOrders) => {
      if (firestoreOrders) {
        setUserOrders(firestoreOrders);
      }
    });

    return () => unsubscribeOrders();
  }, [currentUser?.id]);

  // Cart logic
  const handleAddToCart = (itemToAdd: CartItem) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.cartItemId === itemToAdd.cartItemId);
      if (existingIdx !== -1) {
        const updated = [...prev];
        const updatedQty = updated[existingIdx].quantity + itemToAdd.quantity;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updatedQty,
          totalPrice: updated[existingIdx].unitPrice * updatedQty,
        };
        return updated;
      }
      return [...prev, itemToAdd];
    });
  };

  const handleUpdateCartQuantity = (cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: item.unitPrice * newQty,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  // Wishlist logic
  const handleToggleWishlist = (itemId: string) => {
    setWishlistIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  // Filtered menu items
  const filteredMenuItems = useMemo(() => {
    return menuItemsList.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = searchQuery
        ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      return matchesCategory && matchesSearch;
    });
  }, [menuItemsList, selectedCategory, searchQuery]);

  // Category items count
  const categoryCounts = useMemo(() => {
    const counts: Record<CategoryId, number> = {
      all: menuItemsList.length,
      'regular-pizza': 0,
      'special-pizza': 0,
      'extra-large-pizza': 0,
      'rolls-sandwiches': 0,
      'burgers-shawarma': 0,
      'fries-potatoes': 0,
      'pasta-wings': 0,
      'exclusive-deals': 0,
    };

    menuItemsList.forEach((item) => {
      if (counts[item.category] !== undefined) {
        counts[item.category]++;
      }
    });

    return counts;
  }, [menuItemsList]);

  // Deals items
  const dealItems = useMemo(() => {
    return menuItemsList.filter((i) => i.category === 'exclusive-deals');
  }, [menuItemsList]);

  // Admin handlers
  const handleAddMenuItem = (newItem: MenuItem) => {
    setMenuItemsList((prev) => [newItem, ...prev]);
  };

  const handleUpdateMenuItem = (updatedItem: MenuItem) => {
    setMenuItemsList((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  const handleDeleteMenuItem = (id: string) => {
    setMenuItemsList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['orderStatus']) => {
    setUserOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, orderStatus: status } : o))
    );
  };

  const handlePlaceOrder = (newOrder: Order) => {
    setUserOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <div className="min-h-screen bg-white font-sans text-zinc-900 selection:bg-red-600 selection:text-white overflow-x-hidden w-full relative">
      <SEO
        category={selectedCategory !== 'all' ? selectedCategory.replace('-', ' ').toUpperCase() : undefined}
      />
      {/* 2-3 Second Animated Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Sticky Header */}
      <Navbar
        cartCount={cartItems.reduce((a, b) => a + b.quantity, 0)}
        cartTotal={cartTotal}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => {
          setSelectedCategory('all');
          const menuElem = document.getElementById('menu');
          if (menuElem) menuElem.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenLoyalty={() => setIsLoyaltyOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        menuItems={menuItemsList}
        onSelectItem={(item) => setSelectedModalItem(item)}
        currentUser={currentUser}
      />

      {/* Main Content View */}
      <main id="home">
        {/* Hero Slider showcasing poster banners */}
        <HeroSlider
          onSelectCategory={(cat) => {
            setSelectedCategory(cat as CategoryId);
            const menuElem = document.getElementById('menu');
            if (menuElem) menuElem.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenDeal={(dealId) => {
            const item = menuItemsList.find((i) => i.id === dealId);
            if (item) setSelectedModalItem(item);
          }}
        />

        {/* Categories Tab Bar */}
        <CategoriesNav
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          categoryCounts={categoryCounts}
        />

        {/* Primary Menu Grid */}
        <MenuGrid
          items={filteredMenuItems}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
          onSelectItem={(item) => setSelectedModalItem(item)}
          selectedCategoryName={
            selectedCategory === 'all'
              ? 'OUR COMPLETE MENU'
              : selectedCategory.replace('-', ' ').toUpperCase()
          }
        />

        {/* Special Combo Deals Section */}
        <DealsSection dealItems={dealItems} onAddToCart={handleAddToCart} />

        {/* Pizza Pro Squad Team Section */}
        <SquadSection />

        {/* Packaging Box Showcase */}
        <PackagingSection />

        {/* Food Gallery Lightbox */}
        <FoodGallery />

        {/* Clean & Hygienic Kitchen Section */}
        <KitchenSection />

        {/* Customer Reviews Section */}
        <ReviewsSection />

        {/* FAQ & Google Maps Location */}
        <FAQContactSection />

        {/* EasyPaisa & JazzCash Payment Methods */}
        <PaymentMethodsSection />

        {/* Official Menu Card Section */}
        <MenuCardSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Quick Launcher */}
      <FloatingWhatsApp />

      {/* Gemini AI Assistant Chatbot */}
      <Chatbot />

      {/* Cart Drawer Overlay */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        orderType={orderType}
        setOrderType={setOrderType}
        appliedCoupon={appliedCoupon}
        setAppliedCoupon={setAppliedCoupon}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        orderType={orderType}
        appliedCoupon={appliedCoupon}
        onPlaceOrder={handlePlaceOrder}
        currentUser={currentUser}
      />

      {/* Barcode Scanner & Order Tracker Modal */}
      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        recentOrders={userOrders}
      />

      {/* User Login/OTP Modal */}
      <UserAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        userOrders={userOrders}
      />

      {/* Admin Panel Modal */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        menuItems={menuItemsList}
        onAddMenuItem={handleAddMenuItem}
        onUpdateMenuItem={handleUpdateMenuItem}
        onDeleteMenuItem={handleDeleteMenuItem}
        orders={userOrders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />

      {/* Loyalty Rewards Modal */}
      <LoyaltyModal
        isOpen={isLoyaltyOpen}
        onClose={() => setIsLoyaltyOpen(false)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Food Item Details Modal */}
      <ItemDetailsModal
        item={selectedModalItem}
        onClose={() => setSelectedModalItem(null)}
        isWishlisted={selectedModalItem ? wishlistIds.includes(selectedModalItem.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}

export default App;
