

import { BiServer } from 'react-icons/bi'
import { BsFillKeyFill, BsFillShieldFill, BsCheck2, BsCheck2Circle, BsX, BsXCircle } from 'react-icons/bs'
import { RiFolderForbidFill } from 'react-icons/ri'
import { MdEmail } from 'react-icons/md'

import { useState } from 'react';

export default function EmailHealth() {
    const [domain, setDomain] = useState('google.com');
    const [finalDomain, setFinalDomain] = useState('google.com');
    const [records, setRecords] = useState({});
    const [hidden, setHidden] = useState('hidden');
    const [fadeIn, setFadeIn] = useState('');


    const [spfColor, setSpfColor] = useState('');
    const [dkimColor, setDkimColor] = useState('');
    const [dmarcColor, setDmarcColor] = useState('');

    const handleScan = async () => {
        setHidden('hidden');

        setFinalDomain(domain);

        await fetch(`/api/dns-scan/${domain}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setRecords({ "spf": data.spf, "dkim": data.dkim, "dmarc": data.dmarc })

                parseSPFRecord(data.spf);
                parseDKIMRecord(data.dkim);
                parseDMARCRecord(data.dmarc);


            }).catch((error) => {

                console.error('Error fetching records:', error);
            })

        setHidden('');
        setFadeIn('fadeIn');
    };

    const parseSPFRecord = (spfRecord) => {
        document.getElementById('spf_val').innerHTML = spfRecord && spfRecord.valid ? "Good" : "Bad";

        setSpfColor(spfRecord && spfRecord.valid ? '#00D79A' : '#FF4D4D');
    }

    const parseDKIMRecord = (dkimRecord) => {
        document.getElementById('dkim_pill').classList.add('fadeIn')
        document.getElementById('upill_text').classList.add('fadeIn')
        document.getElementById('upill_text').innerText = "by " + domain

        document.getElementById('dkim_val').innerHTML = dkimRecord ? "Fixed" : "Missing";
        setDkimColor(dkimRecord ? '#00D79A' : '#FF4D4D');
    }

    const parseDMARCRecord = (dmarcRecord) => {
        let dmarcText = "Bad"
        let dColor = "#FF4D4D"
        let pVals = ["none", "quarantine", "reject"]
        if (dmarcRecord && dmarcRecord.v.value === 'DMARC1' && pVals.includes(dmarcRecord.p.value.toLowerCase())) {
            dmarcText = "Good"
            dColor = "#00D79A"
        }
        
        document.getElementById('dmarc_pill').classList.add('fadeIn')
        document.getElementById('dmarc_val').innerHTML = dmarcText;
        setDmarcColor(dColor);
    }


    return (
        <div>
            <h1 className='header'>Email Health</h1>
            <div className='form'>
                <input onChange={(e) => setDomain(e.target.value)} className='input' placeholder='Enter domain name' ></input>
                <button className='scan' onClick={handleScan}>Scan</button>
            </div>

            <table>
                <tr>
                    <th className='grid_header'>Domain</th>
                    <th className='grid_header' style={{ width: "14rem" }}>SPF</th>
                    <th className='grid_header' style={{ width: "14rem" }}>DKIM</th>
                    <th className='grid_header' style={{ width: "15rem" }}>DMARC</th>
                    <th className='grid_header' style={{ width: "14rem" }}>DBL</th>
                </tr>
                <tr>

                    <td className='grid_val'>Peter</td>
                    <td className='grid_val'>
                        <div className={`pill ${hidden} ${fadeIn}`} id="spf_pill" style={{ backgroundColor: spfColor }}>
                            {spfColor === '#FF4D4D' ? (
                                <BsX className='pill_icon' />
                            ) : (
                                <BsCheck2 className='pill_icon' />
                            )}

                            <p className='pill_text' id='spf_val'>Good</p>
                        </div>
                    </td>

                    <td className='grid_val'>
                        <div className={`pill ${hidden} ${fadeIn}`} id="dkim_pill" style={{ backgroundColor: dkimColor }}>
                            {dkimColor === '#FF4D4D' ? (
                                <BsXCircle className='pill_icon' />
                            ) : (
                                <BsCheck2Circle className='pill_icon' />
                            )}

                            <p className='pill_text' id='dkim_val'>fixed</p>
                        </div>
                        <p className={`upill_text ${hidden}`} id='upill_text'></p>
                    </td>

                    <td className='grid_val'>
                        <div className={`pill ${hidden} ${fadeIn}`} id='dmarc_pill' style={{ background: dmarcColor }}>
                            {dmarcColor === '#FF4D4D' ? (
                                <BsX className='pill_icon' />
                            ) : (
                                <BsCheck2 className='pill_icon' />
                            )}

                            <p className='pill_text' id='dmarc_val'>Good</p>
                        </div>
                    </td>

                    <td className='grid_val'>
                        <div className='pill' style={{ backgroundColor: "blue" }}>
                            <BsCheck2 className='pill_icon' />
                            <p className='pill_text' id='dbl_val'>No List</p>
                        </div>
                    </td>
                </tr>
            </table>

            <div className='cards'>
                <div className='card shadow'>
                    <div className="card_interior">
                        <div className='card_top'>
                            <BiServer className='card_icon' />
                            <div className="card_titles">
                                <h3 className='card_title'>SPF</h3>
                                <p className='card_subtitle'>Sender Policy Framework </p>
                            </div>
                        </div>

                        <p className='card_text'>Helps detect and prevent unauthorized IP addresses from sending emails on your behalf</p>
                    </div>
                </div>

                <div className='card shadow'>
                    <div className="card_interior">
                        <div className='card_top'>
                            <span className="card_layer">
                                <BsFillShieldFill className='card_icon' />
                                <BsFillKeyFill className='card_icon cover' style={{ transform: "rotate(135deg) scaleX(-1)" }} />
                            </span>

                            <div className="card_titles">
                                <h3 className='card_title'>DKIM</h3>
                                <p className='card_subtitle'>Domain Keys Identified Mail </p>
                            </div>
                        </div>

                        <p className='card_text'>Helps receiving email servers confirm that you authorized and sent an email from your domain</p>
                    </div>
                </div>

                <div className='card shadow'>
                    <div className="card_interior">

                        <div className='card_top'>
                            <span className="card_layer">
                                <BsFillShieldFill className='card_icon' />
                                <MdEmail className='card_icon cover' style={{ width: "1.5rem", left: "0.75rem" }} />
                            </span>
                            <div className="card_titles">
                                <h3 className='card_title'>DMARC</h3>
                                <p className='card_subtitle'>Domain Message Authentication, Reporting and Conformance </p>
                            </div>
                        </div>


                        <p className='card_text'>DMARC record defines wheter to reject, quarantine or do nothing with the mail that fail to pass SPF or DKIM or both</p>
                    </div>
                </div>

                <div className='card shadow'>
                    <div className="card_interior">
                        <div className='card_top'>
                            <RiFolderForbidFill className='card_icon' />
                            <div className="card_titles">
                                <h3 className='card_title'>DBL</h3>
                                <p className='card_subtitle'>Domain Black Lists </p>
                            </div>
                        </div>

                        <p className='card_text'>A public list of domain names with poor reputations</p>
                    </div>
                </div>
            </div>
        </div>
    )

    // return (
    //     <div>
    //         <h2>Domain Scanner Tool</h2>
    //         <div>
    //             <label htmlFor="domain">Enter domain:</label>
    //             <input
    //                 type="text"
    //                 id="domain"
    //                 value={domain}
    //                 onChange={(e) => setDomain(e.target.value)}
    //             />
    //             <button onClick={handleScan}>Scan</button>
    //         </div>
    //         <div>
    //             <h3>DMARC Record:</h3>
    //             <pre>{dmarcRecord}</pre>
    //         </div>
    //         <div>
    //             <h3>SPF Record:</h3>
    //             <pre>{spfRecord}</pre>
    //         </div>
    //         <div>
    //             <h3>DKIM Record:</h3>
    //             <pre>{dkimRecord}</pre>
    //         </div>
    //     </div>
    // );
}