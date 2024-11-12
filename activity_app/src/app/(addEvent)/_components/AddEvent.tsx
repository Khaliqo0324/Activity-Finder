"use client";

import { Avatar } from "@/components/ui/avatar";
import { Logo } from "../../../components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserAvatar } from "@/components/avatar";
import {Form}  from "@/components/ui/form";
import {useFormField} from "@/components/ui/form";
import {FormItem} from "@/components/ui/form";
import {FormLabel} from "@/components/ui/form";
import {FormControl} from "@/components/ui/form";
import { FormDescription } from "@/components/ui/form";
import {FormMessage} from "@/components/ui/form";
import {FormField} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea";
import { useState } from 'react';

type EventProps = {
    event: {
      name: string;
      activity: string;
      address: string;
      city: string;
      state: string;
      details: string;
    };
}



export const AddEvent = () => {
    const [name, setName] = useState("");
    const [activity, setActivity] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [details, setDetails] = useState("");

    const SignupInfo = ({event} : EventProps) => {
        const outputData = () => {
            <div>
            <h1>Name: {name} </h1>
            <p> Activity: {activity} </p>
            <p>Address {address} </p>
            <p>City: {city} </p>
            <p>State: {state} </p>
            <p>Details: {details} </p>
            </div>
        }
        console.log(outputData);    
    }

    const submitHandler = (e) => {
        console.log(form);
        e.preventDefault();
        if (name != "" && activity != "" && address != "" && city != "" && state != "" && details != ""){
            setName("");
            setActivity("");
            setAddress("");
            setCity("");
            setState("");
            setDetails("");
        }
        console.log(SignupInfo);
    }


    const form = useForm();
   return (
    <div>
        <Form {...form}>
        <form className="space-y-8">
        
        <FormField

            control={form.control}
            name="username"
            render={({ field }) => (
                <FormItem onSubmit={submitHandler}>
                    <FormLabel>Club Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Insert name here" 
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        id="name"
                        type="text" />
                    </FormControl>
                    <FormLabel>Activity Name</FormLabel>
                    <FormControl>
                        <Input placeholder="Insert name here" 
                        onChange={(e) => setActivity(e.target.value)}
                        value={activity}
                        id="activity"
                        type="text" />
                    </FormControl>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                        <Input placeholder="Insert name here" 
                        onChange={(e) => setAddress(e.target.value)}
                        value={address}
                        id="address"
                        type="text" />
                    </FormControl>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                        <Input placeholder="Insert name here" 
                        onChange={(e) => setCity(e.target.value)}
                        value={city}
                        id="city"
                        type="text" />
                    </FormControl>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                        <Input placeholder="Insert name here" 
                        onChange={(e) => setState(e.target.value)}
                        value={state}
                        id="state"
                        type="text" />
                    </FormControl>
                    <FormLabel>More Details</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Insert name here" 
                        onChange={(e) => setDetails(e.target.value)}
                        value={details}
                        id="details"
                        />
                    </FormControl>
                    <FormDescription>This is your public name</FormDescription>
                    <Button type="submit">Submit</Button>
                    <FormMessage />
                </FormItem>
            )}
        />
        
        </form>
        </Form>
       


            


    </div>


   )



}
