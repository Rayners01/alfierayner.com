import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import Image from 'next/image'
import { Lora } from 'next/font/google'
import Link from '@/components/ui/link'
import NowPlaying from '@/components/now-playing'

const lora = Lora({
  subsets: ['latin']
})

export default function Home() {return (
    <div className="flex justify-center items-center h-screen text-green-700">
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
              <Button>
                <Image
                  src='/assets/github.svg'
                  width={20}
                  height={20}
                  alt="Github logo"
                  />
              </Button>
              <Button>
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
        
        <Card className="col-span-3 row-span-1">
        </Card>
        
        <Card className="col-span-3 row-span-2">
        </Card>
        
        <Card className="col-span-3 row-span-1">
        </Card>
        
        <Card className="col-span-3 row-span-1">
        </Card>
        
        <Card className="col-span-3 row-span-1">
          <NowPlaying />
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
}