import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBCardFooter } from 'mdb-react-ui-kit';
import BigNumber from "bignumber.js";
import { ethers } from 'ethers';

function Sell(props) {
	const [sellingPrice, setSellingPrice] = useState(0);
	let index = 0;
	const myBirdz = []
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
					<Form.Label>Price</Form.Label>
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
		// var wei = ethers.utils.bigNumberify(wei);
		console.log('selling price in wei', wei);
		props.contract.methods.putForSale(kbird.url, kbird.name, wei).send({from: props.account})
        .on('confirmation', (con) => {
            if (kbird) {
				// this.setState({
                //     kryptoBirdz: [...this.state.kryptoBirdz, kbirdInfo]
                // });
				let len = props.kryptoBirdz.length;
				let x = props.kryptoBirdz;
				for (let i = 0; i < len; i++) {
					if (x[i].url == kbird.url) {
						x[i].isForSale = true;
						x[i].priceInWei = wei;
					}
					break;
				}

                
                kbird = null;
            } 
        });
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