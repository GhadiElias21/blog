import { Button } from "flowbite-react"

import ghadi from '../assets/ghadi.jpg'
const CallToAction = () => {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center ">
<div className="flex-1 justify-center flex flex-col ">
<h2 className="text-2xl">
    did you enjoy using this website?
</h2>
<p className="text-gray-500 my-2"> check out these projects on my portfolio website</p>
<Button gradientDuoTone='purpleToPink' className="rounded-tl-xl rounded-bl-none">
   <a href='' target="_blank" rel="noopener noreferrer">take a look</a>
</Button>
</div>
<div className="p-7 flex-1">
    <img src={ghadi}/>
</div>


    </div>
  )
}

export default CallToAction