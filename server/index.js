const express = require('express');
const dns = require('dns').promises;

const spf = require('spf-parse');
const dmarc = require('dmarc-solution');

const path = require('path');

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('/api/dns-scan/:domain', async (req, res) => {
    try {
        const { domain } = req.params;

        let dmarcRecord = await getDnsRecord(`_dmarc.${domain}`);
        dmarc.parse(dmarcRecord).then((result) => {
            dmarcRecord = result;
        }).catch((error) => {
            dmarcRecord = null;
        });

        let spfRecord = await getDnsRecord(domain);
        spfRecord = parseSPFRecord(spfRecord);

        const dkimRecord = await getDnsRecord(`google._domainkey.${domain}`);

        res.json({ dmarc: dmarcRecord, spf: spfRecord, dkim: dkimRecord });

    } catch (error) {
        
    }
});

async function getDnsRecord(domain) {
    try {
        const records = await dns.resolve(domain, 'TXT');
        return records.join('\n');
    } catch (error) {
        return null;
    }
}

function parseSPFRecord(spfRecord) {
    if (!spfRecord) {
        return null;
    }

    let hasSpf = false;
    let spfArray = spfRecord.split('\n');
    spfArray.forEach((record) => {
        if (record.startsWith('v=')) {
            spfRecord = record;
            hasSpf = true;
        }
    });

    if (hasSpf) {
        const spfObject = spf(spfRecord);
        return spfObject;
    }

    return null
}

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
})