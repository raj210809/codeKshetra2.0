export function mockDataInvoiceFunction(address: string) {
      return{
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      address: "123 Blockchain Street",
      city: "Cryptoville",
      state: "Ethereum",
      zip: "12345",
      country: "Decentraland",
      evmAddress : address
      }
    
  };


  export const invoices = [
    {
      id: 1,
      createdDate: '2024-07-23',
      payee: '0x909957dcc1B114Fe262F4779e6aeD4d034D96B0f',
      payer: '0x909957dcc1B114Fe262F4779e3aeD4d034D96B0f',
      totalAmount: '1.5 ETH',
      dueDate: '2024-07-30',
      status: 'Pending',
    },
    {
      id: 2,
      createdDate: '2024-07-20',
      payee: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      payer: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
      totalAmount: '0.8 ETH',
      dueDate: '2024-08-05',
      status: 'Paid',
    },
    {
      id: 3,
      createdDate: '2024-07-18',
      payee: '0xbda5747bfd65f08deb54cb465eb87d40e51b197e',
      payer: '0xdD870fA1b7C4700F2BD7f44238821C26f7392148',
      totalAmount: '2.3 ETH',
      dueDate: '2024-07-25',
      status: 'Overdue',
    },
    {
      id: 4,
      createdDate: '2024-07-22',
      payee: '0x1aE0EA34a72D944a8C7603FfB3eC30a6669E454C',
      payer: '0x0A098Eda01Ce92ff4A4CCb7A4fFFb5A43EBC70DC',
      totalAmount: '0.5 ETH',
      dueDate: '2024-08-10',
      status: 'Pending',
    },
    {
      id: 5,
      createdDate: '2024-07-19',
      payee: '0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C',
      payer: '0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB',
      totalAmount: '3.7 ETH',
      dueDate: '2024-07-26',
      status: 'Paid',
    }
  ];

