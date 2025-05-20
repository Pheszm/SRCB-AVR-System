import React, { useState } from 'react';
import Reservations from "./Transactions/Reservations";
import Recent_Transactions from "./Transactions/Recent_Transactions";
import Transactions from "./Transactions/Transactions";


export default function Trasactions() {

    function reloadreturn() {

  }

  return (
    <div>
      <Transactions reload={reloadreturn}/>
      <span className='p-10 inline-block'></span>
      <Reservations reload={reloadreturn}/>
      <span className='p-10 inline-block'></span>
      <Recent_Transactions reload={reloadreturn}/>
    </div>
  );
}
