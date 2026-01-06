"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Modal } from "@/components/ui/Modal";
import { Trash2, Edit, Plus, Search, Mail, Phone } from "lucide-react";

export default function VendorsPage() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [formData, setFormData] = useState({ 
      name: "", contact_name: "", email: "", phone: "", address: "" 
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  async function fetchVendors() {
    setLoading(true);
    try {
        const res = await fetch('/api/vendors');
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        if (data) setVendors(data);
    } catch (error) {
        console.error(error);
        alert("Failed to load vendors");
    } finally {
        setLoading(false);
    }
  }

  const filteredVendors = vendors.filter((v) =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (editingVendor) {
            const res = await fetch(`/api/vendors/${editingVendor.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
        } else {
            const res = await fetch('/api/vendors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
        }
        setIsModalOpen(false);
        setEditingVendor(null);
        setFormData({ name: "", contact_name: "", email: "", phone: "", address: "" });
        fetchVendors();
    } catch (error) {
        alert(error.message);
    }
  };

  const handleEdit = (vendor) => {
    setEditingVendor(vendor);
    setFormData({ 
        name: vendor.name, 
        contact_name: vendor.contact_name, 
        email: vendor.email, 
        phone: vendor.phone,
        address: vendor.address
    });
    setIsModalOpen(true);
  };



  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-surface-900 bg-clip-text text-transparent bg-gradient-to-r from-surface-900 to-surface-600">Vendors</h1>
           <p className="text-surface-500 mt-2 text-lg">Manage your suppliers and partners.</p>
        </div>
        <Button onClick={() => {
            setEditingVendor(null);
            setFormData({ name: "", contact_name: "", email: "", phone: "", address: "" });
            setIsModalOpen(true);
        }} className="w-full sm:w-auto shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30 transition-all">
          <Plus className="mr-2 h-4 w-4" /> Add Vendor
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 bg-white p-4 rounded-xl border border-surface-200 shadow-sm">
        <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
            <Input
            placeholder="Search vendors by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-surface-200 focus:border-brand-500 focus:ring-brand-500 text-surface-900 placeholder:text-surface-400"
            />
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <Table>
          <TableHeader className="bg-brand-50/50">
            <TableRow>
              <TableHead className="font-bold text-brand-800 pl-6 uppercase text-xs tracking-wider">Vendor Name</TableHead>
              <TableHead className="font-bold text-brand-800 uppercase text-xs tracking-wider">Contact</TableHead>
              <TableHead className="font-bold text-brand-800 uppercase text-xs tracking-wider">Contact Info</TableHead>
              <TableHead className="font-bold text-brand-800 uppercase text-xs tracking-wider">Address</TableHead>
              <TableHead className="text-right font-bold text-brand-800 pr-6 uppercase text-xs tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                 <TableRow><TableCell colSpan={5} className="text-center py-12 text-gray-500">Loading vendors...</TableCell></TableRow>
            ) : filteredVendors.length === 0 ? (
                 <TableRow><TableCell colSpan={5} className="text-center py-12 text-gray-500">No vendors found.</TableCell></TableRow>
            ) : (
                filteredVendors.map((vendor) => (
                <TableRow key={vendor.id} className="group hover:bg-brand-50/30 transition-colors border-b border-gray-50 last:border-0">
                  <TableCell className="pl-6">
                    <div className="flex flex-col">
                        <span className="font-bold text-gray-900 group-hover:text-brand-700 transition-colors">{vendor.name}</span>
                        <span className="text-[10px] text-gray-300 font-mono">ID: {vendor.id.slice(0,6)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    <div className="flex items-center gap-3">
                         <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-100 to-brand-50 text-brand-600 flex items-center justify-center text-xs font-bold shadow-sm">
                             {vendor.contact_name ? vendor.contact_name.charAt(0).toUpperCase() : '?'}
                         </div>
                         <span className="font-medium">{vendor.contact_name || 'N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                      <div className="flex flex-col gap-1">
                          {vendor.email ? (
                            <div className="flex items-center text-gray-600 text-sm group-hover:text-brand-600 transition-colors">
                                <Mail className="mr-2 h-3 w-3 text-gray-400 group-hover:text-brand-400" /> 
                                {vendor.email}
                            </div>
                          ) : null}
                          {vendor.phone ? (
                            <div className="flex items-center text-gray-600 text-sm group-hover:text-brand-600 transition-colors">
                                <Phone className="mr-2 h-3 w-3 text-gray-400 group-hover:text-brand-400" /> 
                                {vendor.phone}
                            </div>
                          ) : null}
                          {!vendor.email && !vendor.phone && <span className="text-gray-400 text-sm">-</span>}
                      </div>
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm max-w-xs truncate" title={vendor.address}>{vendor.address || '-'}</TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end space-x-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg" onClick={() => handleEdit(vendor)}>
                        <Edit className="h-4 w-4" />
                        </Button>

                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingVendor ? "Edit Vendor" : "Add Vendor"}
        className="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
             <div className="p-3 bg-brand-50 rounded-lg border border-brand-100 mb-4">
                 <h3 className="text-xs font-bold text-brand-700 uppercase tracking-wide mb-2">Details</h3>
                 <div className="space-y-3">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendor Name <span className="text-red-500">*</span></label>
                        <Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Acme Supplies" className="mt-1" />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact Person</label>
                        <Input value={formData.contact_name} onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })} placeholder="e.g. John Doe" className="mt-1" />
                    </div>
                 </div>
             </div>
             
             <div className="grid grid-cols-2 gap-3">
                 <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label>
                    <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="vendor@example.com" className="mt-1" />
                 </div>
                 <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</label>
                    <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+1 234..." className="mt-1" />
                 </div>
             </div>
             
             <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</label>
                <textarea 
                    className="flex min-h-[60px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow resize-none mt-1"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Full address..."
                />
             </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white shadow-md">
                {editingVendor ? 'Update Vendor' : 'Add Vendor'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
