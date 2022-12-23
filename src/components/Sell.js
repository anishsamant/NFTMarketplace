import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBCardFooter } from 'mdb-react-ui-kit';
import BigNumber from "bignumber.js";
import { ethers } from 'ethers';
import context from 'react-bootstrap/esm/AccordionContext';

function Sell(props) {
	const [sellingPrice, setSellingPrice] = useState(0);
	const [myBirdz, setMyBirdz] = useState();
	let index = 0;
	for(let i = 0; i < props.kryptoBirdz.length; i++) {
		if(props.kryptoBirdz[i].owner == props.account) {
			myBirdz[index++] = props.kryptoBirdz[i];
		}
	}
	const listItems = myBirdz.map((kbird, index) => 
		<MDBCard key={kbird.url} className='token img' style={{maxWidth: '25rem'}}>
			<MDBCardImage 
				src={kbird.url}
				alt={kbird.name}
				position='top'
				height= '250px'
			/>
			<Modal.Body>
        		<Form>
            		<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
					<Form.Label>Current Price: {ethers.utils.formatEther(kbird.priceInWei)}</Form.Label>
					<Form.Control
						type="text"
						placeholder="selling price in ETH"
						autoFocus
						onInput = {e => setSellingPrice(e.target.value)}
					/>
					</Form.Group>
				</Form>
			</Modal.Body>
			<MDBCardFooter className="projects-card-footer">
				{/* <input type='text' placeholder='Selling Price in ETH' onChange={handleTextChange}></input> */}
				<button className='sell-btn' onClick={() => sellNFT(kbird)}>Sell</button>
			</MDBCardFooter>
		</MDBCard>
	);

	function sellNFT(kbird) {
		console.log('kbird', kbird);
		var wei = ethers.utils.parseEther(sellingPrice);
		console.log('selling price in wei', wei);
		props.contract.methods.putForSale(kbird.url, kbird.name, wei).send({from: props.account})
        .on('confirmation', (con) => {
            if (kbird) {
				// this.setState({
                //     kryptoBirdz: [...this.state.kryptoBirdz, kbirdInfo]
                // });
				let len = context.state.kryptoBirdz.length;
				let tmpBirdz = context.state.kryptoBirdz;
				let tmpBird = {};
				let ind = -1;
				for (let i = 0; i < len; i++) {
					if (tmpBirdz[i].url == kbird.url) {
						tmpBird = {
							url: tmpBirdz[i].url,
							owner: tmpBirdz[i].owner,
							name: tmpBirdz[i].name,
							isForSale: true,
							priceInWei: wei.toString()
						}
						ind = i;
						break;
					}
				}
				if (ind >= 0) {
					myBirdz.splice(ind, 1, tmpBird);
					setMyBirdz(myBirdz);
				}                
                kbird = null;
            } 
        });
		setSellingPrice(0);
	}

    return (
      <Modal
        {...props}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Sell your NFTs
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {/* <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>To Address</Form.Label>
            </Form.Group>
          </Form> */}
		<div className="cards-container-style row">  
			{listItems}
		</div>
        </Modal.Body>
        <Modal.Footer>
            {/* <Button onClick={() => transfer(props.contract, props.from, inp, props.tokenid, props.context)}>Send</Button> */}
            <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

export default Sell;