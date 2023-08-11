import React from "react"

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "#FFFFFF"
    }

    function createDots() {
        const dotsArr = []
        for (let i = 0; i < props.value; i++) { 
            dotsArr.push(
                <span key={i} className='dot'>
                </span>
            )
        }
        return dotsArr
    }

    return (
        <div 
            className="die"
            style={styles}
            onClick={props.handleClick}
        >
            {createDots()}
        </div>
    )
}