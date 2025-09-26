'use client';

import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import Image from 'next/image'
import { Lora } from 'next/font/google'
import Link from '@/components/ui/link'
import NowPlaying from '@/components/now-playing'
import VisitedCountriesCard from '@/components/visited-countries-card'
import { useState, useRef, useEffect } from 'react';
import Globe from '@/components/globe'
const lora = Lora({
  subsets: ['latin']
})

export default function Home() {

  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [lastOffset, setLastOffset] = useState({ x: 0, y: 0});
  const [lastVelocity, setLastVelocity] = useState({ vx: 0, vy: 0});
  const [moving, setMoving] = useState(false)
  const [globe, setGlobe] = useState(false);

  const flyingRef = useRef(false)
  const velocityRef = useRef({ vx: 0, vy: 0 })

  const onStartFlying = (vx: number, vy: number) => {
    setMoving(true);
    velocityRef.current = { vx, vy }
    flyingRef.current = true
  }

  const onStopFlying = () => {
    flyingRef.current = false
  }

  useEffect(() => {
    let animationFrame: number

    const animate = () => {
      if (moving) {
        if (lastOffset.x === 0 && lastOffset.y === 0) {
          setOffset(prev => {
            const newX = prev.x - velocityRef.current.vx * window.innerWidth * 2
            const newY = prev.y - velocityRef.current.vy * window.innerHeight * 2

            if (Math.abs(newX) > window.innerWidth || Math.abs(newY) > window.innerHeight) {
              flyingRef.current = false
              setMoving(false)
              setGlobe(true);
              setLastOffset({x: newX, y: newY});
              setLastVelocity({ vx: velocityRef.current.vx, vy: velocityRef.current.vy })
              console.log('reached');
              return { x: 0, y: 0 }
            }

            return { x: newX, y: newY }
          })
        } else {
            setOffset(prev => {
              let newX = prev.x + lastVelocity.vx * window.innerWidth * 1.5;
              let newY = prev.y + lastVelocity.vy * window.innerHeight * 1.5;

              if ((lastVelocity.vx > 0 && newX > 0) || (lastVelocity.vx < 0 && newX < 0)) {
                newX = 0;
              }
              if ((lastVelocity.vy > 0 && newY > 0) || (lastVelocity.vy < 0 && newY < 0)) {
                newY = 0;
              }

              if (newX === 0 && newY === 0) {
                setMoving(false);
                setLastOffset({x:0,y:0});
                setLastVelocity({vx:0,vy:0});
                return { x:0, y:0 };
              }

              return { x: newX, y: newY }
            }) 
        }
      }

      animationFrame = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(animationFrame)
  }, [moving])

  const goBack = () => {
    console.log(lastOffset);
    console.log(lastVelocity);
    setOffset(lastOffset);
    setGlobe(false);
    setMoving(true);
  }

    const mainPage = (
      <div 
        className="flex justify-center items-center h-screen text-green-700 overflow-hidden"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
        }}
      >
        <div className="w-3/4 h-[90%] grid grid-cols-12 grid-rows-8 gap-4">
          <Card className="col-span-9 row-span-4 flex flex-row">
            <div className="m-4 w-2/3 flex flex-col justify-between">
              <div>
                <p className="text-green-500">welcome</p>
                <p>
                  Hi, I&lsquo;m <strong>Alfie Rayner</strong>, a Computer Science student at the University of Warwick.
                </p>
              </div>
              <div className="flex flex-row gap-4 w-full h-10">
                <Button className="w-1/5">
                  <Image
                    src='/assets/github.svg'
                    width={20}
                    height={20}
                    alt="Github logo"
                    />
                </Button>
                <Button className="w-1/5">
                  <Image
                    src='/assets/linkedin.svg'
                    width={20}
                    height={20}
                    alt="Github logo"
                    />
                </Button>
              </div>
            </div>
            <div className="w-1/3 flex justify-center items-center p-4">
              <Image 
                src='/assets/alfie_rayner.jpg'
                width={200}
                height={200}
                alt="Photo of Alfie Rayner, taken at Victoria Falls, Zimbabwe."
                className="rounded-full border-green-700 border-4"
                />
            </div>
          </Card>
          
          <Card className="col-span-3 row-span-6 text-sm">
            <h1 className="text-xl font-semibold">About me</h1>
            <p>I&lsquo;m a software developer from Brighton, England.</p>
            <br></br>
            <p>Currently, I am in my second-year of my MEng Computer Science degree at the University of Warwick.</p>
            <br></br>
            <p>My interests in Computer Science include:</p>
            <ul className="list-disc ml-4">
              <li>Full-stack Development</li>
              <li>Artificial Intelligence</li>
              <li>Database Structures</li>
              <li>Data Science</li>
            </ul>
            <br></br>
            <p>I primarily code in Java and JavaScript, however I also have experience using Python, C and C#.</p>
            <br></br>
            <p>Beyond programming, I&lsquo;m passionate about music, travelling, photography, playing the piano and football.</p>
          </Card>
          
          <Card className="col-span-3 row-span-4">
            <h1 className="text-xl font-semibold">Contact me!</h1>
            <br></br>
            <p className="italic text-green-500">E-mail</p>
            <p>contact@alfierayner.com</p>
            <br></br>
            <p className="italic text-green-500">Phone number</p>
            <p>+44 7576 998476</p>
            <br></br>
            <p className="italic text-green-500">Social Media</p>
            <p>
              <Link href="https://www.github.com/Rayners01">
                Github
              </Link>
            </p>
            <p>
              <Link href="https://www.linkedin.com/in/alfie-rayner-ab64a633a/">
                LinkedIn
              </Link>
            </p>

          </Card>
          
          <Card className="col-span-3 row-span-1 flex justify-center items-center">
            <p className={`text-xl ${lora.className}`}>{(new Date()).toLocaleString('en-GB', { hour: 'numeric', minute: 'numeric', hour12: true}).toUpperCase()} BST</p>
          </Card>

          <div className="col-span-3 row-span-1 bg-lime-200 border-green-700 border-2 rounded-lg
        hover:border-yellow-400">
            <VisitedCountriesCard 
              onStartFlying={onStartFlying}
              onStopFlying={onStopFlying}
            />
          </div>
          
          <Card className="col-span-3 row-span-2">
            <NowPlaying />
          </Card>
          
          <Card className="col-span-3 row-span-1">
          </Card>
          
          <Card className="col-span-3 row-span-1">
          </Card>
          
          <Card className="col-span-3 row-span-1">
          </Card>
          
          <Card className="col-span-3 row-span-1">
          </Card>

          <Card className="col-span-3 row-span-1">
          </Card>
          
          <Card className="col-span-3 row-span-1 text-sm">
            <p>&copy; 2025 Alfie Rayner</p>
            <p>Created with <Link href="https://nextjs.org">Next.js</Link></p>
          </Card>
        </div>
      </div>
    )

    const globePage = (
      <div className="h-screen w-full"
      >
        <Button
          onClick={goBack}
          className="mt-4 ml-4 p-4"
          width="20"
          height="10"
        >
          Back
        </Button>

        <div className="flex flex-col items-center">
          <Card className="px-6 py-4 rounded-lg border-green-700 border-2 bg-lime-100 w-fit">
            <h2 className="text-xl font-semibold text-green-700">Countries I have visited</h2>
          </Card>

          <Globe />
        </div>
      </div>
    )


    return globe ? globePage : mainPage;
}