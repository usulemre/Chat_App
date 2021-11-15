import React, { useEffect, useState } from 'react'

function Image(props) {
    const [imageSrc, setimageSrc] = useState("")

    useEffect(() => {
        const reader = new FileReader();
        reader.readAsDataURL(props.blob);
        reader.onload = function() {
            setimageSrc(reader.result)
        }
    }, [props.blob])

    return (
        <img style={{width:150,height:'auto'}} src={imageSrc} alt={props.fileName}/>
    )
}

export default Image
