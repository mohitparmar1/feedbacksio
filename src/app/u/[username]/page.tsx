"use client";
import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React from "react";
import { useForm } from "react-hook-form";

function page() {
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const onSubmit = async (data : z.infer<typeof messageSchema>) => {
    try {
      
    } catch (error) {
      
    }
  };
  return <div>Message Page</div>;
}

export default page;
