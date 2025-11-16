import React from 'react'
import RosatomLogo from './RosatomLogo'

export default function Footer(){
    return (
        <footer style={{ backgroundColor: '#1a2165' }} className="mt-20">
            <div className="container-max py-8">
                <div className="flex items-center">
                    <RosatomLogo variant="white" height={32} />
                </div>
            </div>
        </footer>
    )
}
