import type { ReactElement } from "react"

type props = {
    children:ReactElement;
}
export const Layout =({children}:props)=>{
    return <><div >
    <div className="text-[20px] font-bold text-blue-500 justify-center flex">web Wallet By Ishant Khatri </div>
   <div>{children}</div>
 <div className="text-[20px] font-semibold justify-center flex">for more ptoject visit my <a className="text-purple-500" href="https://github.com/ishant1412">github profile</a>
</div>
</div>
    </>
}

