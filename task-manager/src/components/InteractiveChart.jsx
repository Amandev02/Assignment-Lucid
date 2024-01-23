import { useState, useEffect } from 'react';

import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import './InteractiveChart.css'
import {read,utils,writeFile} from 'xlsx';
import { Button } from 'react-bootstrap';
defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

const ChartComponent = () => {
  const [dnsRecords, setDNSRecords] = useState([]);

const fetchDNSRecords = async () => {
    try {
      // Replace 'your-backend-api-endpoint' with the actual API endpoint to fetch DNS records
      const response = await fetch(`https://assignment-lucid2.vercel.app/api/all-records`);
      const data = await response.json();
      // console.log(data.roleData);
      setDNSRecords(data.roleData);
     
    } catch (error) {
      console.error('Error fetching DNS records:', error);
    }

  };

  useEffect(() => {
    fetchDNSRecords();
  }, []);

    // Count the number of domain addresses for each unique name
    const countIPsByUniqueNames = () => {
      const ipCountMap = new Map();
  
      dnsRecords.forEach(record => {
        const { type,name,value } = record;
  
        if (ipCountMap.has(name)) {
          ipCountMap.set(name, ipCountMap.get(name) + 1);
        } else {
          ipCountMap.set(name, 1);
        }
      });
  
      return ipCountMap;
    };
    //count of number of type for unique type
    const countIPsByUniqueType = () => {
      const ipCountMap = new Map();
  
      dnsRecords.forEach(record => {
        const { type,name,value } = record;
         
        if (ipCountMap.has(type)) {
          ipCountMap.set(type, ipCountMap.get(type) + 1);
        } else {
          ipCountMap.set(type, 1);
        }
      });
  
      return ipCountMap;
    };
  
    const ipNameCount = countIPsByUniqueNames();
    const ipTypeCount = countIPsByUniqueType();

    const handleExport = () =>{
      const headings = [["Id","Type","Name","Value","CreatedAt","UpdatedAt"]];
      const wb = utils.book_new();
      const ws = utils.json_to_sheet([]);
      utils.sheet_add_aoa(ws, headings);
      utils.sheet_add_json(ws, dnsRecords, {origin: "A2", skipHeader: true});
      utils.book_append_sheet(wb,ws,"Records");
      writeFile(wb, "Records.xlsx");
     };
      

  

  return (
    <>
    <div className='top'>
    <Button className='btn mx-5 my-3 mb-5 circular' variant="secondary" onClick={handleExport}>Export</Button>
    </div>
    <div className='interactivechart'>
    
      <div className="dataCard barCard">
        <Bar
          data={{
            labels: Array.from(ipNameCount.keys()),
            datasets: [
              {
                label: "Count",
                data: Array.from(ipNameCount.values()),
                backgroundColor: [
                  'rgba(0, 102, 204, 0.8)',
  'rgba(204, 51, 0, 0.8)',
  'rgba(204, 102, 0, 0.8)',
  'rgba(153, 0, 204, 0.8)',
  'rgba(51, 102, 0, 0.8)',
  'rgba(204, 0, 102, 0.8)',
  'rgba(0, 102, 102, 0.8)',
  'rgba(102, 0, 51, 0.8)',
  'rgba(51, 102, 102, 0.8)',
  'rgba(153, 51, 0, 0.8)',
  'rgba(102, 51, 0, 0.8)',
  'rgba(102, 0, 153, 0.8)',
  'rgba(153, 102, 51, 0.8)',
  'rgba(51, 0, 102, 0.8)',
  'rgba(102, 102, 0, 0.8)',
  'rgba(0, 51, 102, 0.8)',
  'rgba(102, 0, 0, 0.8)',
  'rgba(51, 0, 51, 0.8)',
  'rgba(153, 51, 51, 0.8)',
  'rgba(204, 0, 0, 0.8)',
                  "rgba(43, 63, 229, 0.8)",
                  "rgba(250, 192, 19, 0.8)",
                  "rgba(253, 135, 135, 0.8)",
                ],
                borderRadius: 5,
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                text: "Domain Name Distribution",
              },
            },
          }}
        />
      </div>

      <div className="dataCard doughnutCard">
        <Doughnut
          data={{
            labels: Array.from(ipNameCount.keys()),
            datasets: [
              {
                label: "Count",
                data: Array.from(ipNameCount.values()),
                backgroundColor: [
                  'rgba(0, 102, 204, 0.8)',
  'rgba(204, 51, 0, 0.8)',
  'rgba(204, 102, 0, 0.8)',
  'rgba(153, 0, 204, 0.8)',
  'rgba(51, 102, 0, 0.8)',
  'rgba(204, 0, 102, 0.8)',
  'rgba(0, 102, 102, 0.8)',
  'rgba(102, 0, 51, 0.8)',
  'rgba(51, 102, 102, 0.8)',
  'rgba(153, 51, 0, 0.8)',
  'rgba(102, 51, 0, 0.8)',
  'rgba(102, 0, 153, 0.8)',
  'rgba(153, 102, 51, 0.8)',
  'rgba(51, 0, 102, 0.8)',
  'rgba(102, 102, 0, 0.8)',
  'rgba(0, 51, 102, 0.8)',
  'rgba(102, 0, 0, 0.8)',
  'rgba(51, 0, 51, 0.8)',
  'rgba(153, 51, 51, 0.8)',
  'rgba(204, 0, 0, 0.8)',
                  "rgba(43, 63, 229, 0.8)",
                  "rgba(250, 192, 19, 0.8)",
                  "rgba(253, 135, 135, 0.8)",
                ],
                backgroundColor: [
                  'rgba(0, 102, 204, 0.8)',
  'rgba(204, 51, 0, 0.8)',
  'rgba(204, 102, 0, 0.8)',
  'rgba(153, 0, 204, 0.8)',
  'rgba(51, 102, 0, 0.8)',
  'rgba(204, 0, 102, 0.8)',
  'rgba(0, 102, 102, 0.8)',
  'rgba(102, 0, 51, 0.8)',
  'rgba(51, 102, 102, 0.8)',
  'rgba(153, 51, 0, 0.8)',
  'rgba(102, 51, 0, 0.8)',
  'rgba(102, 0, 153, 0.8)',
  'rgba(153, 102, 51, 0.8)',
  'rgba(51, 0, 102, 0.8)',
  'rgba(102, 102, 0, 0.8)',
  'rgba(0, 51, 102, 0.8)',
  'rgba(102, 0, 0, 0.8)',
  'rgba(51, 0, 51, 0.8)',
  'rgba(153, 51, 51, 0.8)',
  'rgba(204, 0, 0, 0.8)',
                  "rgba(43, 63, 229, 0.8)",
                  "rgba(250, 192, 19, 0.8)",
                  "rgba(253, 135, 135, 0.8)",
                ],
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                text: "Domain Name Distribution",
              },
            },
          }}
        />
      </div>

      <div className="dataCard barCard">
        <Bar
          data={{
            labels: Array.from(ipTypeCount.keys()),
            datasets: [
              {
                label: "Count",
                data: Array.from(ipTypeCount.values()),
                backgroundColor: [
                  "rgba(43, 63, 229, 0.8)",
                  "rgba(250, 192, 19, 0.8)",
                  "rgba(253, 135, 135, 0.8)",
                  'rgba(153, 0, 204, 0.8)',
  'rgba(51, 102, 0, 0.8)',
  'rgba(204, 0, 102, 0.8)',
  'rgba(153, 102, 51, 0.8)',
  'rgba(51, 0, 102, 0.8)',
  'rgba(102, 102, 0, 0.8)',
  'rgba(0, 51, 102, 0.8)',
  'rgba(0, 102, 102, 0.8)',
                ],
                borderRadius: 5,
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                text: "DNS Record Types",
              },
            },
          }}
        />
      </div>

      <div className="dataCard doughnutCard">
        <Doughnut
          data={{
            labels: Array.from(ipTypeCount.keys()),
            datasets: [
              {
                label: "Count",
                data:Array.from(ipTypeCount.values()),
                backgroundColor: [
                  "rgba(43, 63, 229, 0.8)",
                  "rgba(250, 192, 19, 0.8)",
                  "rgba(253, 135, 135, 0.8)",
                  'rgba(153, 0, 204, 0.8)',
                  'rgba(153, 102, 51, 0.8)',
  'rgba(51, 0, 102, 0.8)',
  'rgba(102, 102, 0, 0.8)',
  'rgba(0, 51, 102, 0.8)',
  'rgba(51, 102, 0, 0.8)',
  'rgba(204, 0, 102, 0.8)',
  'rgba(0, 102, 102, 0.8)',
                ],
                borderColor: [
                  "rgba(43, 63, 229, 0.8)",
                  "rgba(250, 192, 19, 0.8)",
                  "rgba(253, 135, 135, 0.8)",
                  'rgba(153, 0, 204, 0.8)',
                  'rgba(153, 102, 51, 0.8)',
  'rgba(51, 0, 102, 0.8)',
  'rgba(102, 102, 0, 0.8)',
  'rgba(0, 51, 102, 0.8)',
  'rgba(51, 102, 0, 0.8)',
  'rgba(204, 0, 102, 0.8)',
  'rgba(0, 102, 102, 0.8)',
                ],
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                text: "DNS Record Types",
              },
            },
          }}
        />
      </div>

    </div>
    </>
  );
};

export default ChartComponent;
