'use client'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import messages from '@/messages-data.json';
import Autoplay from 'embla-carousel-autoplay'

const Home = () => {
  
  return (
    <main className='flex grow flex-col items-center justify-center px-4 md:px-24 py-12 bg-background'>
      <section className='text-center mb-12 md:mb-20 space-y-6'>
        <h1 className='text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none'>
          Mystry <span className="text-primary-foreground bg-primary px-4 py-2 shadow-[8px_8px_0px_0px_var(--foreground)] dark:shadow-[8px_8px_0px_0px_var(--secondary)] inline-block">Message</span>
        </h1>
        <p className='text-xl md:text-2xl font-bold uppercase'>Dive into the world of <span className="text-secondary dark:text-accent">Anonymous</span> Conversations</p>
        <p className='text-muted-foreground font-medium max-w-xl mx-auto'>Explore Mystry Message — Where your identity remains a secret.</p>
      </section>
      <Carousel
      plugins={[Autoplay({delay: 2000})]}
       className="w-full max-w-lg">
      <CarouselContent>
        {
          messages.map((message, index) => (
            <CarouselItem key={index}>
            <div className="p-4">
              <Card className="min-h-[200px] flex flex-col justify-between">
                  <CardHeader className="font-black text-2xl uppercase">
                    {message.title}
                  </CardHeader>
                <CardContent className="flex items-center justify-center p-6 text-lg font-bold">
                  <span>{message.content}</span>
                </CardContent>
                <CardFooter className="font-mono text-sm opacity-50">
                  {message.received}
                </CardFooter>
              </Card>
            </div>
          </CarouselItem>
          ))
        }
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    </main>
  )
}

export default Home
