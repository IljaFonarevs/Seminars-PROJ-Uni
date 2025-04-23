import React, { useState } from 'react';
import "./Seat.css"

function Seat(bgColor: string, number: number) {

    return (
        // <div className = "seat-block" style={{ backgroundColor: bgColor }}>
        <div className = "seat-block" style={{ backgroundColor: 'blue' }}>
            <div> {number} </div>
        </div>
    )
}
