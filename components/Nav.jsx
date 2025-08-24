

export default function Nav({ active, onSelect }){

    return(
       <nav>
            <ul>
                <li><a onClick={() => onSelect("index")} href="#">Thomas Chap Vinette</a></li>
                {active === "index" ? (
                <>
                <li><a onClick={() => onSelect("Info")} href="#">Information</a></li>
                <li><a onClick={() => onSelect("work")} href="#">Projects</a></li>
                </>
                ) : null}
            </ul>
       </nav>
    )
}