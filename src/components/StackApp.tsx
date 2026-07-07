/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, UserProfile } from '../types';
import { INITIAL_PRODUCTS } from '../data/mockData';
import { 
  ShoppingBag, MapPin, Search, Plus, Sliders, Map, RefreshCw, 
  Layers, Package, Check, DollarSign, Store, Compass, Info, HelpCircle,
  ShoppingCart, Trash2, Minus, UserCheck, ChevronRight, Sparkles,
  Sprout, Shirt, Palette, Truck, Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Comprehensive, detailed mock database profiles for the sellers
const SELLER_DETAILS: { 
  [storeName: string]: { 
    description: string; 
    rating: number; 
    completedTrades: number; 
    category: string; 
    verification: string; 
    responseTime: string; 
  } 
} = {
  'Nyeri Highlands Coffee Cooperatives': {
    description: 'A community-owned agricultural cooperative of over 2,500 smallholder family farms in Nyeri County, Kenya. Sourcing highest grade volcanic Arabica beans since 1982 with strict quality control.',
    rating: 4.9,
    completedTrades: 1432,
    category: 'Agriculture & Farm Sourcing',
    verification: 'Certified Fair-Trade & Organic USDA',
    responseTime: '< 2 hours'
  },
  'Lagos Textile Emporium': {
    description: 'A premium artisanal boutique specializing in premium quality authentic handwoven and wax-dyed Ankara cotton panels. Working with and empowering local female guild weavers.',
    rating: 4.8,
    completedTrades: 890,
    category: 'Textiles & Ankara Apparel',
    verification: 'Nigerian Craft Council Verified',
    responseTime: '< 4 hours'
  },
  'Kamba Woodcarvers Guild': {
    description: 'A prestigious master-carver collective honoring generations of fine craftsmanship in Machakos and Mombasa, Kenya. All ebony and rosewood is sourced from certified conservation forests.',
    rating: 4.7,
    completedTrades: 320,
    category: 'Handcrafted Woodworks & Art',
    verification: 'KEBS Forestry Authenticated',
    responseTime: '< 24 hours'
  },
  'Continuum Logistics Group': {
    description: 'Leading logistics & container freight partner across major African free trade corridors. Specialized in custom deep-sea port routing, refrigerated transit, and fast inter-city dispatch.',
    rating: 5.0,
    completedTrades: 14200,
    category: 'Regional Third-Party Logistics (3PL)',
    verification: 'ISO-9001 Sourcing certified',
    responseTime: '< 15 mins'
  },
  'Mahlangu Distributors': {
    description: 'A Johannesburg-based wholesale distributor and retail sourcer looking to import premium East and West African craftwork, coffee beans, and boutique apparel.',
    rating: 4.6,
    completedTrades: 150,
    category: 'B2B Wholesale Trade & Imports',
    verification: 'SADC Trade Registered',
    responseTime: '< 6 hours'
  }
};

const getSellerDetail = (storeName: string) => {
  return SELLER_DETAILS[storeName] || {
    description: `Independent merchant operating on Continuum Stack platform. Committed to premium regional trade, secure logistics tracking, and local community growth.`,
    rating: 5.0,
    completedTrades: 1,
    category: 'Verified Merchant',
    verification: 'Continuum Protocol Insured',
    responseTime: '< 1 hour'
  };
};

const CATEGORY_META: { [key: string]: { icon: React.ComponentType<any>; color: string; bg: string; border: string } } = {
  'Agriculture': { icon: Sprout, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-100 dark:border-emerald-900/30' },
  'Agriculture & Farm Sourcing': { icon: Sprout, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-100 dark:border-emerald-900/30' },
  'Apparel': { icon: Shirt, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/30', border: 'border-indigo-100 dark:border-indigo-900/30' },
  'Textiles & Ankara Apparel': { icon: Shirt, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/30', border: 'border-indigo-100 dark:border-indigo-900/30' },
  'Art & Crafts': { icon: Palette, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-100 dark:border-amber-900/30' },
  'Handcrafted Woodworks & Art': { icon: Palette, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-100 dark:border-amber-900/30' },
  'Logistics': { icon: Truck, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-950/30', border: 'border-sky-100 dark:border-sky-900/30' },
  'Regional Third-Party Logistics (3PL)': { icon: Truck, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-950/30', border: 'border-sky-100 dark:border-sky-900/30' },
  'Retail': { icon: Briefcase, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/30', border: 'border-rose-100 dark:border-rose-900/30' },
  'B2B Wholesale Trade & Imports': { icon: Briefcase, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/30', border: 'border-rose-100 dark:border-rose-900/30' },
};

const getCategoryMeta = (category: string) => {
  const norm = (category || '').trim();
  if (CATEGORY_META[norm]) return CATEGORY_META[norm];
  
  // Fuzzy match
  const lower = norm.toLowerCase();
  if (lower.includes('agri') || lower.includes('farm')) {
    return CATEGORY_META['Agriculture'];
  }
  if (lower.includes('apparel') || lower.includes('textile') || lower.includes('cloth') || lower.includes('wear')) {
    return CATEGORY_META['Apparel'];
  }
  if (lower.includes('art') || lower.includes('craft') || lower.includes('wood') || lower.includes('carv')) {
    return CATEGORY_META['Art & Crafts'];
  }
  if (lower.includes('logistics') || lower.includes('transit') || lower.includes('freight') || lower.includes('3pl')) {
    return CATEGORY_META['Logistics'];
  }
  if (lower.includes('retail') || lower.includes('wholesale') || lower.includes('import') || lower.includes('trade') || lower.includes('merchant')) {
    return CATEGORY_META['Retail'];
  }
  
  // Default fallback
  return { icon: Package, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-950/30', border: 'border-teal-100 dark:border-teal-900/30' };
};

interface StackAppProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onAddTransaction?: (tx: any) => void;
}

export default function StackApp({ user, onUpdateUser, onAddTransaction }: StackAppProps) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [activeTab, setActiveTab] = useState<'listings' | 'maps' | 'store'>('listings');
  const [mode, setMode] = useState<'Buyer' | 'Seller'>('Buyer');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Radius filter in KM
  const [radiusKm, setRadiusKm] = useState<number>(30);
  // Center coordinates (simulating user is centered in Nairobi/Lagos crossover)
  const [userLat] = useState<number>(-1.2921);
  const [userLng] = useState<number>(36.8219);

  // Store creation states
  const [storeName, setStoreName] = useState('');
  const [newProdTitle, setNewProdTitle] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Agriculture');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [storeCreated, setStoreCreated] = useState(false);

  // Map state
  const [selectedPin, setSelectedPin] = useState<Product | null>(null);

  // Shopping Cart & Detail Modal states
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  const addToCart = (product: Product, quantity = 1, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation(); // Avoid triggering details modal if clicked inside card
    }
    
    if (product.price <= 0) {
      setErrorToast("Logistics hubs cannot be added to cart. Connect directly!");
      setTimeout(() => setErrorToast(null), 3000);
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });

    setCheckoutSuccess(`Added "${product.title}" to cart!`);
    setTimeout(() => setCheckoutSuccess(null), 3000);
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean) as { product: Product; quantity: number }[];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const handleCheckout = () => {
    const totalCost = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    if (user.balance < totalCost) {
      setErrorToast(`Insufficient Wallet Balance! You need $${(totalCost - user.balance).toFixed(2)} more.`);
      setTimeout(() => setErrorToast(null), 4000);
      return;
    }

    // Deduct balance
    const updatedUser = {
      ...user,
      balance: user.balance - totalCost,
      xp: user.xp + Math.floor(totalCost * 0.1) // Reward 10% XP
    };
    onUpdateUser(updatedUser);

    // Register Transaction
    if (onAddTransaction) {
      onAddTransaction({
        id: `tx-cart-${Date.now()}`,
        type: 'purchase',
        amount: totalCost,
        currency: 'USD',
        status: 'Completed',
        description: `B2B Purchase: ${cart.length} catalog items from Continuum Stack.`,
        timestamp: new Date().toISOString()
      });
    }

    setCheckoutSuccess(`Checkout Complete! $${totalCost.toFixed(2)} paid from Continuum Wallet.`);
    setCart([]);
    setIsCartOpen(false);
    
    setTimeout(() => {
      setCheckoutSuccess(null);
      setActiveTab('maps');
    }, 4500);
  };

  // Distance calculator helper (Haversine formula)
  const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };

  // Filter products by radius and searchQuery
  const filteredProducts = products.filter((prod) => {
    // If warehouse, skip strict local radius filter or set a large default
    const distance = getDistanceFromLatLonInKm(userLat, userLng, prod.lat, prod.lng);
    const matchesRadius = distance <= radiusKm || prod.type === 'Warehouse';
    const matchesSearch = prod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prod.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRadius && matchesSearch;
  });

  const handleCreateStoreProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(newProdPrice);
    if (!newProdTitle || isNaN(priceNum)) return;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      title: newProdTitle,
      storeName: storeName || `${user.username} Store`,
      price: priceNum,
      currency: 'USD',
      rating: 5.0,
      image: uploadedImageUrl || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
      lat: userLat + (Math.random() - 0.5) * 0.1, // Nearby user
      lng: userLng + (Math.random() - 0.5) * 0.1,
      type: 'Seller',
      category: newProdCategory,
      stock: 50,
      locationName: 'Nairobi CBD, Kenya',
      description: newProdDesc
    };

    setProducts([newProd, ...products]);
    setStoreCreated(true);
    setTimeout(() => {
      setStoreCreated(false);
      setActiveTab('listings');
    }, 2000);

    // Reset fields
    setNewProdTitle('');
    setNewProdPrice('');
    setNewProdDesc('');
    setUploadedImageUrl('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    // Simulate image optimization delay
    setTimeout(() => {
      setUploadedImageUrl('https://images.unsplash.com/photo-1544816155-12df9643f363?w=400');
      setIsUploading(false);
    }, 1500);
  };

  return (
    <div className="glass-card rounded-[32px] p-6 transition-all duration-300">
      
      {/* Platform Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShoppingBag className="text-teal-500 w-5 h-5" />
            Continuum Stack: African Enterprise & Logistics Hub
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build wholesale store models, source organic agricultural goods, and utilize Google Maps integration to track regional fulfillment warehouses.
          </p>
        </div>

        {/* Mode & Cart Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Shopping Cart Trigger Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative px-4 py-2 text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.02]"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Wholesale Cart</span>
            {cart.length > 0 && (
              <span className="bg-rose-600 text-white text-[10px] rounded-full px-1.5 py-0.5 font-mono font-bold ml-1 animate-pulse">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>

          {/* Mode Selector */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto whitespace-nowrap scrollbar-none max-w-full">
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 px-1.5 flex-shrink-0">Trade mode:</span>
            {['Buyer', 'Seller'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m as any)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  mode === m
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {m} mode
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Internal Navigation */}
      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-2 mb-6 overflow-x-auto scrollbar-none">
        {[
          { id: 'listings', label: 'Trade Catalog', icon: ShoppingBag },
          { id: 'maps', label: 'Nearby Maps Platform', icon: Map },
          { id: 'store', label: 'Store Setup & Inbound', icon: Store }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 pb-2 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                isActive 
                  ? 'border-teal-500 text-teal-600 dark:text-teal-400 font-bold' 
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
        
        {/* CATALOG VIEW */}
        {activeTab === 'listings' && (
          <div className="space-y-6">
            
            {/* Search & Sliders Filter panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 glass-card p-4 rounded-xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter coffee, fabrics, carving..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-1.5 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white rounded-lg focus:outline-none glass-input"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              </div>

              {/* Radius slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-500">
                  <span>Google Maps Radius:</span>
                  <span className="font-mono text-teal-600">{radiusKm} KM</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={200}
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
              </div>

              <div className="flex items-center justify-end">
                <span className="text-[10px] text-slate-400 font-mono">
                  Displaying {filteredProducts.length} local trade nodes
                </span>
              </div>
            </div>

            {/* Header with Cart Action */}
            <div className="flex justify-between items-center bg-slate-100/60 dark:bg-slate-950/40 p-3.5 rounded-2xl border border-slate-200/50 dark:border-white/5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Store className="w-4 h-4 text-teal-500" />
                Explore Regional Wholesale Listings
              </span>
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer shadow-md shadow-emerald-900/10 transition-all active:scale-95"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>My Secure Cart</span>
                <span className="bg-white text-emerald-700 font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </button>
            </div>

            {/* Products grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => {
                const distance = getDistanceFromLatLonInKm(userLat, userLng, prod.lat, prod.lng);
                return (
                  <div 
                    key={prod.id} 
                    onClick={() => setSelectedProduct(prod)}
                    className="glass-card glass-card-hover overflow-hidden rounded-[24px] flex flex-col justify-between cursor-pointer group hover:scale-[1.01] transition-all duration-300"
                  >
                    <div>
                      <div className="h-40 bg-slate-100/30 dark:bg-slate-900/10 relative overflow-hidden">
                        <img src={prod.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md text-[9px] text-white px-2 py-0.5 rounded font-mono font-bold">
                          {prod.type} node
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          {(() => {
                            const meta = getCategoryMeta(prod.category);
                            const IconComponent = meta.icon;
                            return (
                              <span className={`inline-flex items-center gap-1 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${meta.bg} ${meta.color} ${meta.border}`}>
                                <IconComponent className="w-2.5 h-2.5 flex-shrink-0" />
                                <span>{prod.category}</span>
                              </span>
                            );
                          })()}
                          <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">
                            📍 {prod.locationName}
                          </span>
                        </div>

                        <h3 className="font-bold text-slate-900 dark:text-white text-xs group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors">{prod.title}</h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{prod.description}</p>
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-2.5 border-t border-slate-200/50 dark:border-white/5 flex justify-between items-center bg-slate-50/20">
                      <div>
                        {prod.price > 0 ? (
                          <>
                            <span className="text-[9px] text-slate-400 block font-mono">Unit Cost</span>
                            <span className="text-xs font-black text-slate-900 dark:text-white">${prod.price}</span>
                          </>
                        ) : (
                          <span className="text-[10px] text-teal-600 font-bold uppercase">Logistics Open</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Distance Badge */}
                        <span className="text-[9px] font-mono bg-slate-100 dark:bg-slate-900 text-slate-500 px-2 py-1 rounded">
                          {distance.toFixed(1)} KM
                        </span>

                        {/* Cart Action inside card */}
                        {prod.price > 0 ? (
                          <button
                            onClick={(e) => addToCart(prod, 1, e)}
                            className="flex items-center gap-1 bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg shadow-sm cursor-pointer transition-all active:scale-95"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProduct(prod);
                            }}
                            className="bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-teal-500 hover:bg-slate-200 dark:hover:bg-slate-800 text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors"
                          >
                            <span>Info</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* MAPS INTERACTIVE VIEW */}
        {activeTab === 'maps' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* List on maps sidebar */}
            <div className="lg:col-span-1 glass-card p-4 rounded-xl space-y-3 h-[400px] overflow-y-auto">
              <h4 className="font-bold text-slate-900 dark:text-white text-xs border-b pb-2 mb-2">Nearby Entities Radius</h4>
              {filteredProducts.map((p) => {
                const distance = getDistanceFromLatLonInKm(userLat, userLng, p.lat, p.lng);
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPin(p)}
                    className={`w-full p-2.5 rounded-lg border text-start space-y-1 transition-all cursor-pointer ${
                      selectedPin?.id === p.id
                        ? 'border-teal-500 bg-teal-500/10 text-teal-700'
                        : 'border-slate-100 dark:border-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[11px] truncate block max-w-[120px]">{p.title}</span>
                      <span className="text-[9px] font-mono font-bold bg-slate-100 dark:bg-slate-900 px-1.5 text-slate-500 rounded">{p.type}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>{p.locationName}</span>
                      <span>{distance.toFixed(1)} KM</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Google Maps Mockup Canvas */}
            <div className="lg:col-span-3 bg-slate-900 border border-slate-200/20 dark:border-white/5 rounded-[24px] relative overflow-hidden h-[400px] flex items-center justify-center">
              
              {/* Grid abstract mapping bg */}
              <div className="absolute inset-0 opacity-15" style={{ 
                backgroundImage: 'radial-gradient(circle, #319795 1.5px, transparent 1.5px)', 
                backgroundSize: '24px 24px' 
              }}></div>

              {/* Dynamic Range Circle overlay represent radius */}
              <div className="absolute w-72 h-72 rounded-full border-2 border-dashed border-teal-500/35 bg-teal-500/5 flex items-center justify-center animate-pulse">
                <span className="text-[10px] text-teal-400/80 font-mono">Interactive {radiusKm}KM Mapping Boundary</span>
              </div>

              {/* Center User Pin */}
              <div className="absolute z-10 flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-indigo-500 border-2 border-white animate-bounce flex items-center justify-center shadow-lg"></div>
                <span className="text-[8px] bg-slate-900/80 text-indigo-300 font-bold px-1 py-0.5 rounded mt-1">Your Base (Nairobi)</span>
              </div>

              {/* Dynamic Product pins relative positioning */}
              {filteredProducts.map((p) => {
                const isSelected = selectedPin?.id === p.id;
                // Compute offset multiplier based on coordinates
                const xOffset = (p.lng - userLng) * 400; // arbitrary scale for display mapping
                const yOffset = (userLat - p.lat) * 400;

                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPin(p)}
                    className="absolute cursor-pointer transition-all hover:scale-110 flex flex-col items-center"
                    style={{ transform: `translate(${xOffset}px, ${yOffset}px)` }}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full border border-white flex items-center justify-center text-[7px] font-bold text-white shadow-md ${
                      isSelected 
                        ? 'bg-rose-500 animate-ping' 
                        : p.type === 'Warehouse' 
                          ? 'bg-purple-600' 
                          : p.type === 'Buyer' 
                            ? 'bg-indigo-600' 
                            : 'bg-teal-500'
                    }`}>
                      {p.type[0]}
                    </div>
                  </div>
                );
              })}

              {/* Pin Detail Overlay Panel */}
              <AnimatePresence>
                {selectedPin && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-md p-4 rounded-xl border border-slate-800 text-white flex gap-3 items-center shadow-2xl"
                  >
                    <img src={selectedPin.image} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] uppercase font-bold text-teal-400 font-mono tracking-wider flex items-center gap-1">
                          {(() => {
                            const meta = getCategoryMeta(selectedPin.category);
                            const IconComponent = meta.icon;
                            return (
                              <>
                                <IconComponent className="w-2.5 h-2.5 text-teal-400 flex-shrink-0" />
                                <span>{selectedPin.type} node | {selectedPin.category}</span>
                              </>
                            );
                          })()}
                        </span>
                        <button onClick={() => setSelectedPin(null)} className="text-xs text-slate-400 hover:text-white">✕</button>
                      </div>
                      <h4 className="font-bold text-xs truncate mt-0.5">{selectedPin.title}</h4>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">Location: {selectedPin.locationName}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Map Controls */}
              <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-teal-500"></div> Sellers</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-600"></div> Buyers</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-purple-600"></div> Warehouses</div>
              </div>

            </div>
          </div>
        )}

        {/* STORE SETUP TAB */}
        {activeTab === 'store' && (
          <div className="max-w-xl mx-auto glass-card p-6 rounded-[24px] space-y-5">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs border-b border-slate-200/40 dark:border-white/5 pb-2 flex items-center gap-1.5">
              <Store className="w-4 h-4 text-teal-500" /> Establish Storefront & Inbound Goods
            </h3>
            
            <form onSubmit={handleCreateStoreProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Company / Store Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nairobi Volcanic Beans"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white rounded-lg focus:outline-none glass-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Organic Arabica Coffee"
                    value={newProdTitle}
                    onChange={(e) => setNewProdTitle(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white rounded-lg focus:outline-none glass-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Price per unit ($ USD)</label>
                  <input
                    type="number"
                    required
                    placeholder="25"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white rounded-lg focus:outline-none glass-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Trade Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white rounded-lg focus:outline-none glass-input"
                  >
                    <option value="Agriculture">Agriculture / Farming</option>
                    <option value="Apparel">Textiles & Ankara Apparel</option>
                    <option value="Art & Crafts">Handmade Carvings / Art</option>
                    <option value="Logistics">Logistics fulfillment</option>
                  </select>
                </div>
              </div>

              {/* Drag-drop or browse image selector mockup */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Optimized Product Image Upload</label>
                <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-white/50 dark:bg-slate-950/50 text-center relative cursor-pointer hover:bg-white/70 dark:hover:bg-slate-900/70 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {isUploading ? (
                    <div className="flex flex-col items-center justify-center gap-1.5 py-2">
                      <RefreshCw className="w-5 h-5 text-teal-500 animate-spin" />
                      <span className="text-[10px] text-slate-400">Performing Web-Optimizations...</span>
                    </div>
                  ) : uploadedImageUrl ? (
                    <div className="text-teal-600 text-[10px] font-bold flex items-center justify-center gap-1.5">
                      <Check className="w-4 h-4" /> Image optimized & buffered securely!
                    </div>
                  ) : (
                    <div className="text-slate-400 text-[10px]">
                      Drag & Drop product display photo, or <strong className="text-indigo-500">browse file</strong>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Product Description</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Explain sourcing methods, quality benchmarks, and wholesale logistics availability..."
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white rounded-lg focus:outline-none glass-input"
                />
              </div>

              <div className="flex justify-end pt-2 border-t">
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg cursor-pointer"
                >
                  Publish Store storefront
                </button>
              </div>
            </form>

            {storeCreated && (
              <div className="bg-teal-500/10 border border-teal-500/20 text-teal-600 text-xs p-3 rounded-lg text-center font-bold">
                Storefront Published Successfully! Coordinates mapped to Google Maps search engine.
              </div>
            )}
          </div>
        )}

      </div>

      {/* SHOPPING CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity" onClick={() => setIsCartOpen(false)} />
            
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-screen max-w-md bg-white dark:bg-slate-950 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800"
              >
                {/* Cart Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-teal-500" />
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">African Trade Cart</h3>
                  </div>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-500 dark:hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Cart Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                      <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                      <div>
                        <p className="text-slate-700 dark:text-slate-300 font-semibold text-xs">Your cart is empty</p>
                        <p className="text-slate-400 text-[10px] mt-1">Explore the Trade Catalog to add regional goods.</p>
                      </div>
                    </div>
                  ) : (
                    cart.map(({ product, quantity }) => (
                      <div key={product.id} className="flex gap-4 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200/50 dark:border-white/5">
                        <img src={product.image} className="w-14 h-14 object-cover rounded-lg" />
                        
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <span className="text-[8px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wide">{product.storeName}</span>
                            <h4 className="font-bold text-slate-900 dark:text-white text-xs truncate mt-0.5">{product.title}</h4>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs font-black text-slate-900 dark:text-white">${(product.price * quantity).toFixed(2)}</span>
                            
                            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-md p-1 border border-slate-200/50 dark:border-slate-700">
                              <button 
                                onClick={() => updateCartQuantity(product.id, -1)}
                                className="p-0.5 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-[11px] font-bold font-mono px-1.5 text-slate-800 dark:text-slate-200">{quantity}</span>
                              <button 
                                onClick={() => updateCartQuantity(product.id, 1)}
                                className="p-0.5 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <button 
                          onClick={() => removeFromCart(product.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer self-start"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Cart Footer */}
                {cart.length > 0 && (
                  <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Total Items</span>
                        <span className="font-bold font-mono">{cart.reduce((sum, item) => sum + item.quantity, 0)} units</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Continuum Wallet Balance</span>
                        <span className="font-mono text-indigo-500 dark:text-indigo-400">${user.balance.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white">
                        <span>Total Order Amount</span>
                        <span className="font-mono text-teal-600">${cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toFixed(2)}</span>
                      </div>
                    </div>

                    <button 
                      onClick={handleCheckout}
                      className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Confirm & Checkout Securely</span>
                    </button>
                    <p className="text-[9px] text-slate-400 text-center font-mono">
                      Payments held in Continuum Escrow until shipping coordinates verified on Google Maps.
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* PRODUCT & SELLER DETAILS MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity" onClick={() => setSelectedProduct(null)} />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Header Close button */}
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900/80 text-white flex items-center justify-center cursor-pointer transition-colors shadow-md"
              >
                ✕
              </button>

              {/* Modal scrollable container */}
              <div className="flex-1 overflow-y-auto">
                {/* Product Banner/Image */}
                <div className="h-56 relative bg-slate-100 dark:bg-slate-900">
                  <img src={selectedProduct.image} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-4 left-6 right-6 text-white space-y-2">
                    {(() => {
                      const meta = getCategoryMeta(selectedProduct.category);
                      const IconComponent = meta.icon;
                      return (
                        <span className={`inline-flex items-center gap-1.5 text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border bg-slate-950/80 backdrop-blur-md ${meta.color} ${meta.border}`}>
                          <IconComponent className="w-3 h-3 flex-shrink-0" />
                          <span>{selectedProduct.category}</span>
                        </span>
                      );
                    })()}
                    <h3 className="font-extrabold text-lg md:text-xl leading-snug">{selectedProduct.title}</h3>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Product Info & Pricing */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Product Sourcing & Specs</h4>
                      <p className="text-slate-700 dark:text-slate-300 text-xs mt-1 leading-relaxed">
                        {selectedProduct.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/50">
                        <span className="text-[9px] text-slate-400 block font-mono">Stock Level</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{selectedProduct.stock > 0 ? `${selectedProduct.stock} units` : 'Out of Stock'}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/50">
                        <span className="text-[9px] text-slate-400 block font-mono font-bold">Transit Location</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate block">📍 {selectedProduct.locationName}</span>
                      </div>
                    </div>

                    {selectedProduct.price > 0 && (
                      <div className="bg-indigo-50/50 dark:bg-indigo-950/25 p-3 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/30 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-indigo-500 animate-pulse" /> Quick Bulk Order
                          </span>
                          <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500">Add bulk quantities instantly</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => {
                              addToCart(selectedProduct, 10);
                              setSelectedProduct(null);
                            }}
                            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-xl cursor-pointer shadow-sm hover:shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-1.5"
                          >
                            <span>+10 Units</span>
                            <span className="text-[9px] opacity-75 font-mono">(${selectedProduct.price * 10})</span>
                          </button>
                          <button
                            onClick={() => {
                              addToCart(selectedProduct, 50);
                              setSelectedProduct(null);
                            }}
                            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-xl cursor-pointer shadow-sm hover:shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-1.5"
                          >
                            <span>+50 Units</span>
                            <span className="text-[9px] opacity-75 font-mono">(${selectedProduct.price * 50})</span>
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <div>
                        {selectedProduct.price > 0 ? (
                          <>
                            <span className="text-[9px] text-slate-400 block font-mono">Unit Price</span>
                            <span className="text-lg font-black text-slate-900 dark:text-white">${selectedProduct.price}</span>
                          </>
                        ) : (
                          <span className="text-xs font-bold text-teal-500 uppercase font-mono">Logistics Open Port</span>
                        )}
                      </div>

                      {/* Add to Cart button inside modal */}
                      {selectedProduct.price > 0 && (
                        <button
                          onClick={() => {
                            addToCart(selectedProduct, 1);
                            setSelectedProduct(null);
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-black rounded-xl cursor-pointer shadow-md transition-all active:scale-95"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Seller Profile */}
                  <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Verified Seller Profile</h4>
                        <span className="text-[9px] font-mono bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold flex items-center gap-1">
                          <UserCheck className="w-3 h-3" /> Active Partner
                        </span>
                      </div>
                      
                      <h3 className="font-black text-slate-900 dark:text-white text-sm mt-2 flex items-center gap-1.5">
                        <Store className="w-4 h-4 text-indigo-500" />
                        {selectedProduct.storeName}
                      </h3>
                      
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-2 italic">
                        "{getSellerDetail(selectedProduct.storeName).description}"
                      </p>
                    </div>

                    <div className="space-y-2 text-[10px] border-t border-slate-200/50 dark:border-slate-800/80 pt-3">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-mono">Merchant Rating</span>
                        <span className="font-bold text-amber-500 flex items-center gap-0.5 font-sans">
                          ★ {getSellerDetail(selectedProduct.storeName).rating.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-mono">B2B Trades Finished</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{getSellerDetail(selectedProduct.storeName).completedTrades} completed</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-mono">Business Category</span>
                        {(() => {
                          const meta = getCategoryMeta(getSellerDetail(selectedProduct.storeName).category);
                          const IconComponent = meta.icon;
                          return (
                            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                              <IconComponent className={`w-3.5 h-3.5 ${meta.color}`} />
                              <span>{getSellerDetail(selectedProduct.storeName).category}</span>
                            </span>
                          );
                        })()}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-mono">Credentials</span>
                        <span className="font-bold text-teal-600 dark:text-teal-400 text-right max-w-[130px] truncate" title={getSellerDetail(selectedProduct.storeName).verification}>
                          {getSellerDetail(selectedProduct.storeName).verification}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-mono">Average Response</span>
                        <span className="font-bold text-indigo-500">{getSellerDetail(selectedProduct.storeName).responseTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING TOAST NOTIFICATIONS */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none max-w-sm">
        <AnimatePresence>
          {checkoutSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center gap-2.5 border border-emerald-500/25 text-xs font-bold pointer-events-auto"
            >
              <Check className="w-4 h-4 bg-white text-emerald-600 rounded-full p-0.5 flex-shrink-0" />
              <span>{checkoutSuccess}</span>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {errorToast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 bg-rose-600 text-white rounded-2xl shadow-2xl flex items-center gap-2.5 border border-rose-500/25 text-xs font-bold pointer-events-auto"
            >
              <Info className="w-4 h-4 bg-white text-rose-600 rounded-full p-0.5 flex-shrink-0" />
              <span>{errorToast}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
