"use client";

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
import React, { createContext, useContext} from 'react';

// Define the form schema



const formSchema = z.object({
  name: z.string().min(1, "Club name is required"),
  activity: z.string().min(1, "Activity name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  details: z.string().min(1, "Details are required"),
});





// Infer the form type from the schema
type FormValues = z.infer<typeof formSchema>;

export const handlePinTitle = (value: string): any => {
   
}




export const AddEvent = () => {
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
        
      
       
        console.log("Form submitted with data:", values);
        form.reset();
        
    };

    return (
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
    );
};