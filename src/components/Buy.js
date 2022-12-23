import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBCardFooter } from 'mdb-react-ui-kit';
import BigNumber from "bignumber.js";
import { Contract, ethers } from 'ethers';

function Buy(props) {
	let index = 0;
	const myBirdz = []
	for(let i = 0; i < props.kryptoBirdz.length; i++) {
		if(props.kryptoBirdz[i].owner != props.account && props.kryptoBirdz[i].isForSale == true) {
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
					<Form.Label>Buy Price: {ethers.utils.formatEther(kbird.priceInWei)}</Form.Label>
					</Form.Group>
				</Form>
			</Modal.Body>
			<MDBCardFooter className="projects-card-footer">
				<button className='sell-btn' onClick={() => buyNFT(kbird, index)}>Buy</button>
			</MDBCardFooter>
		</MDBCard>
	);

	async function buyNFT(kbird) {
		const web3 = props.web3;
		console.log(kbird);
		let bal = await web3.eth.getBalance(props.account)
		console.log(bal);
		let gasAmount = await props.contract.methods.buyNFT(kbird.url, kbird.name, kbird.priceInWei).estimateGas({ from: props.account });

		if (Number(bal) + gasAmount > Number(kbird.priceInWei)) {
			props.contract.methods.buyNFT(kbird.url, kbird.name, kbird.priceInWei).send({from: props.account, value: kbird.priceInWei})
			.on('confirmation', (con) => {
				if (kbird) {
					let ind = -1;
					let NFTs = [...props.kryptoBirdz];
					for (let i = 0; i < NFTs.length; i++) {
						if (NFTs[i].url == kbird.url) {
							ind = i;
							break;
						}
					}
					let item = {...props.context.state.kryptoBirdz[ind]};
					item.isForSale = false;
					item.owner = props.account;
					props.context.state.kryptoBirdz[ind] = item;
					props.context.setState({
						kryptoBirdz: props.context.state.kryptoBirdz
					});
					kbird = null;
					props.context.setState({showSell: false});
					window.alert("Buy Successful");

				}
			});
		}
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
            Buy NFTs
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

export default Buy;