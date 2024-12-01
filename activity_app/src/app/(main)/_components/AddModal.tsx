import React from 'react';

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormField } from "@/components/ui/form";
import { FormItem } from "@/components/ui/form";
import { FormLabel } from "@/components/ui/form";
import { FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Location, SearchState, Place, Event, EVENT_TYPES } from './types';


interface onAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
    name: z.string().min(1, "Club name is required"),
    activity: z.string().min(1, "Activity name is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    details: z.string().min(1, "Details are required"),
  });

  /** 
const handleMap = (
    callback: (params: {lat: number; lng: number; name?: string; type?: string}) => void,
    params: {lat: number, lng: number; name?: string}
) => {
    callback(params);
};
*/





export const AddModal = ({ isOpen, onClose }: onAddModalProps) => {
  if (!isOpen) return null;

  type FormValues = z.infer<typeof formSchema>;







    // Initialize form with proper types
    
    
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            activity: "",
            address: "",
            city: "",
            state: "",
            details: "",
        },
    });

    // Form submission handler
    const onSubmit = (values: FormValues) => {
        
        //handleMap(addMap, mapParams);
        console.log("Form submitted with data:", values);
        form.reset();
        
    };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Add Event</h2>
          <button onClick={onClose} className="text-xl">×</button>
        </div>
        <div className="space-y-4">
          {/* */}
         
        <div className="max-w-2xl mx-auto p-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="name"
                        
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Club Name</FormLabel>
                                <FormControl>
                                    <Input id="title" placeholder="Enter club name" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="activity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Activity Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter activity name" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter address" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter city" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter state" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="details"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>More Details</FormLabel>
                                <FormControl>
                                    <Textarea 
                                        placeholder="Enter additional details"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full">Submit Event</Button>
                </form>
            </Form>
        </div>
 
        </div>
      </div>
    </div>
  );
};
