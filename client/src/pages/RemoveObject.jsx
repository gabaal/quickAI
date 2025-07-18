import {Scissors, Sparkles } from "lucide-react"
import { useState } from "react"
import axios from 'axios'
import toast from "react-hot-toast"
import { useAuth } from "@clerk/clerk-react"


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL


const RemoveObject = () => {
  const [input, setInput] = useState('')
  const [object, setObject] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')


      const { getToken } = useAuth()
    const onSubmitHandler = async (e) => {
      e.preventDefault()
      try {
        setLoading(true)

if(object.split(' ').length > 1) {
  return toast.error('Please provide a single object name to remove')
}

          const formData = new FormData()
          formData.append('image', input)
          formData.append('object', object)
          
          const {data} = await axios.post('/api/ai/remove-image-object', formData, {
            headers: {
              Authorization: `Bearer ${await getToken()}`
            }
          })
          if (data.success) {
            setContent(data.content)
            setLoading(false)
          } else {
            toast.error(data.message || 'Failed to remove object')
            setLoading(false)
          }
        
      } catch (error) {
        toast.error(error.message || 'Failed to remove object')
        
      }
      setLoading(false)
    }


  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      <form onSubmit={onSubmitHandler} className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#8e37eb]" />
          <h1 className="text-xl font-semibold">Object Removal</h1>

        </div>
        <p className="mt-6 text-xm font-medium">Upload Image</p>
        <input onChange={(e) => setInput(e.target.files[0])} accept='image/*' type='file' className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600" required />
       
    <p className="mt-6 text-xm font-medium">Describe object to remove</p>
        <textarea onChange={(e) => setObject(e.target.value)} value={object} rows={4} className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300" placeholder='e.g. watch or spoon, only single object name' required />

        <button disabled={loading} className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417df6] to-[#8e37eb] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer">
          

{
  loading ? <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span> : <Scissors className="w-5" />
}
          Remove Object
        </button>
      </form>

      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center gap-3">
          <Scissors className="w-5 h-5 text-[#4a7aff]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>

        {
          ! content ? (<div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <Scissors className="w-9 h-9" />
            <p className="">Upload image and click 'Remove Object' to get started</p>
          </div>
        </div>) : (
          <div className="flex-1 flex justify-center items-center">
            <img src={content} alt="Processed" className="max-w-full max-h-full object-contain" />
          </div>
        )
        }
      </div>
    </div>
  )
}
export default RemoveObject