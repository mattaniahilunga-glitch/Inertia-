/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, UserProfile } from '../types';
import { INITIAL_PRODUCTS } from '../data/mockData';
import { 
  ShoppingBag, MapPin, Search, Plus, Sliders, Map, RefreshCw, 
  Layers, Package, Check, DollarSign, Store, Compass, Info, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StackAppProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
}

export default function StackApp({ user, onUpdateUser }: StackAppProps) {
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
            Inertia Stack: African Enterprise & Logistics Hub
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Build wholesale store models, source organic agricultural goods, and utilize Google Maps integration to track regional fulfillment warehouses.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
          <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 px-1.5">Trade mode:</span>
          {['Buyer', 'Seller'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m as any)}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
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

      {/* Internal Navigation */}
      <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 pb-2 mb-6 overflow-x-auto">
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
              className={`flex items-center gap-1.5 pb-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
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

            {/* Products grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => {
                const distance = getDistanceFromLatLonInKm(userLat, userLng, prod.lat, prod.lng);
                return (
                  <div key={prod.id} className="glass-card glass-card-hover overflow-hidden rounded-[24px] flex flex-col justify-between">
                    <div>
                      <div className="h-40 bg-slate-100/30 dark:bg-slate-900/10 relative overflow-hidden">
                        <img src={prod.image} className="w-full h-full object-cover" />
                        <div className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md text-[9px] text-white px-2 py-0.5 rounded font-mono font-bold">
                          {prod.type} node
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400 tracking-wider">
                            {prod.category}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            📍 {prod.locationName}
                          </span>
                        </div>

                        <h3 className="font-bold text-slate-900 dark:text-white text-xs">{prod.title}</h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{prod.description}</p>
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-2 border-t border-slate-200/50 dark:border-white/5 flex justify-between items-center bg-slate-50/20">
                      <div>
                        {prod.price > 0 ? (
                          <>
                            <span className="text-[9px] text-slate-400 block">Unit Cost</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">${prod.price}</span>
                          </>
                        ) : (
                          <span className="text-[10px] text-teal-600 font-bold uppercase">Logistics Open</span>
                        )}
                      </div>

                      {/* Distance Badge */}
                      <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-900 text-slate-500 px-2 py-0.5 rounded">
                        {distance.toFixed(1)} KM away
                      </span>
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
                        <span className="text-[9px] uppercase font-bold text-teal-400 font-mono tracking-wider">{selectedPin.type} node | {selectedPin.category}</span>
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

    </div>
  );
}
