import React, { useCallback } from "react"
import Die from "./components/Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import "./style.css"

export default function App() {
    const [stats, setStats] = React.useState({
        numOfRolls: 0,
        timeUsed: 0,
        id: nanoid()
    })
    const [records, setRecords] = React.useState(
        () => JSON.parse(localStorage.getItem("records")) || []
    )
    const [dice, setDice] = React.useState(allNewDice()) 
    const [tenzies, setTenzies] = React.useState(false)
    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)

        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])

    const timer = useCallback(() => {
        setStats(oldStat => ({
            ...oldStat,
            timeUsed: oldStat.timeUsed + 1
        }))
    }, [])

    React.useEffect(() => {
        if (tenzies) {
            return
        }
        const time = setInterval(timer, 1000)
        return () => clearInterval(time)
    }, [timer, tenzies])

    React.useEffect(() => {
        localStorage.setItem("records", JSON.stringify(records))
    }, [records])
    
    const diceElement = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            handleClick={() => holdDice(die.id)}
        />
    ))

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }

    function allNewDice() {
        let newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }    

    function rollDice() {
        if (!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? die : generateNewDie()
            }))
            setStats(oldStat => ({
                ...oldStat,
                numOfRolls: oldStat.numOfRolls + 1
            }))
        }
        else {
            setRecords(prevRecords => {
                const newRecords = [stats, ...prevRecords]
                return newRecords.sort((a , b) => 
                    a.timeUsed - b.timeUsed || 
                    a.numOfRolls - b.numOfRolls)
            })
            setTenzies(false)
            setDice(allNewDice())
            setStats({
                numOfRolls: 0,
                timeUsed: 0
            })
        }
    }

    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            if (die.id === id) {
                return {
                    ...die,
                    isHeld: !die.isHeld
                }
            } else {
                return die
            }
        }))
    }

    return (
        <main>
            {
                tenzies && 
                <Confetti 
                    width={window.innerWidth} 
                    height={window.innerHeight}
                />
            }
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="stats">
                <p className="best-record">
                    Best Record: 
                    <span className="bold">{records.length !== 0 ? records[0].timeUsed : 0} sec</span> 
                    &
                    <span className="bold">{records.length !== 0 ? records[0].numOfRolls : 0} rolls</span>
                </p>
                <div>
                    <p><span className="bold">Number of Rolls: </span> {stats.numOfRolls} rolls</p>
                    <p><span className="bold">Time Used: </span> {stats.timeUsed} sec</p>
                </div>
            </div>
            <div className="dice-container">
                {diceElement}
            </div>
            <button 
                className="roll" 
                onClick={rollDice}
            >
                {tenzies ? 'New Game' : 'Roll'}
            </button>
        </main>
    )
}