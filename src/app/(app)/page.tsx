"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AutoPlay from "embla-carousel-autoplay";
import messages from "@/messages.json";
import { Mail } from "lucide-react";
import Link from "next/link";

function page() {
  return (
    <>
      <main className="flex flex-col items-center justify-center">
        <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="flex flex-col items-center justify-center px-4 py-10 md:py-24">
          <section>
            <h1 className="text-5xl font-semibold ">
              True Opinions, Total Privacy,
            </h1>
            <p className="animate-text-gradient text-5xl inline-flex bg-gradient-to-r from-neutral-900 via-slate-500 to-neutral-500 bg-[200%_auto] bg-clip-text leading-tight text-transparent dark:from-neutral-100 dark:via-slate-400 dark:to-neutral-400 ">
              Feedback Made Anonymous.
            </p>
          </section>
        </div>
        <Carousel
          plugins={[AutoPlay({ delay: 2000 })]}
          className="w-full max-w-lg md:max-w-xl"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0" />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </main>
      <footer className=" text-sm flex flex-grow items-center justify-center font-sans font-semibold text-center p-4 md:p-6 text-black-primary ">
        developed by @
        <Link href="https://github.com/mohitparmar1">
          <p>mohitparmar1</p>
        </Link>
      </footer>
    </>
  );
}

export default page;
