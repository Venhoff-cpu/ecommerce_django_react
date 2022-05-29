import {useEffect, useState} from "react";

const Rating = ({prodRating, numReviews, color = "#f8e825", id}) => {
    const [startRating, setStartRating] = useState([])
    useEffect(()=>{
        const newRating = [];
        for (let step = 1; step < 6; step++){
            let starClass = "";
            if(prodRating >= step) {
                starClass='fas fa-star';
            } else if(prodRating >= step - 0.5){
                starClass='fas fa-star-half-alt';
            } else {
                starClass = "far fa-star"
            }
            newRating.push(
                (
                <span key={`rating_${step}_${id}`}>
                    <i style={{color}} className={starClass}></i>
                </span>
                )
            )
        }
        setStartRating(newRating)
    }, [prodRating, color, id])
    return (
        <div className="rating">
            {startRating.map((object) => object)}
            <span>
                {numReviews && `${numReviews} reviews`}
            </span>
        </div>
    )
}

export default Rating;
