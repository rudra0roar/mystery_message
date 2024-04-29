"use client"
import Image from "next/image";
import * as React from "react"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import messages from "@/messages.json"
import Autoplay from "embla-carousel-autoplay"

export default function Home() {
  console.log("idhar aaya bhai message to dihao",messages);
  return (
    <main className="flex flex-grow flex-col items-center justify-between md:px-24 px-4 py-12">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold">Dive into the Mystery World of Anonymous Conversations</h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg">Explore Mystery Message - Where Your Destiny Remains a secret.</p>
      </section>
      <Carousel
      plugins={[Autoplay({DelayNode : 2000})]}
      className="w-full max-w-xs">
      <CarouselContent>
       {messages.map((message , index) =>  (
        <CarouselItem key={index}>
        <div className="p-1">
          <Card>
            <CardHeader>{message.title}</CardHeader>
            <CardContent className="flex aspect-square items-center justify-center p-6">
              <span className="text-lg font-semibold">{message.content}</span>
            </CardContent>
            <CardFooter>
              {message.received}
            </CardFooter>
          </Card>
        </div>
      </CarouselItem>
       ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    </main>
  );
}
