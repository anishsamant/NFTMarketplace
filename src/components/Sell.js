import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBCardFooter } from 'mdb-react-ui-kit';
import BigNumber from "bignumber.js";
import { ethers } from 'ethers';

function Sell(props) {
	const [loaderShow, setLoadShow] = useState(true);
	var Loader = require('react-loader');

	var options = {
		lines: 13,
		length: 20,
		width: 10,
		radius: 30,
		scale: 1.00,
		corners: 1,
		color: '#0000ff',
		opacity: 0.25,
		rotate: 0,
		direction: 1,
		speed: 1,
		trail: 60,
		fps: 20,
		zIndex: 2e9,
		top: '50%',
		left: '50%',
		shadow: false,
		hwaccel: false,
		position: 'absolute'
	};

	const [sellingPrice, setSellingPrice] = useState(0);
	const myBirdz = [];

	for(let i = 0; i < props.kryptoBirdz.length && props.context.state.showSell; i++) {
		if(props.kryptoBirdz[i].owner == props.account) {
			myBirdz.push(props.kryptoBirdz[i]);
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
					<Form.Label>Last Sell Price: {ethers.utils.formatEther(kbird.priceInWei)}</Form.Label>
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
				<button className='sell-btn' onClick={() => sellNFT(kbird, index)}>Sell</button>
			</MDBCardFooter>
		</MDBCard>
	);

	function sellNFT(kbird, index) {
		console.log('kbird', kbird);
		var wei = ethers.utils.parseEther(sellingPrice);
		console.log('selling price in wei', wei);
		setLoadShow(false);
		props.contract.methods.putForSale(kbird.url, kbird.name, wei).send({from: props.account})
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
				item.isForSale = true;
				item.priceInWei = wei;
				props.context.state.kryptoBirdz[ind] = item;
				props.context.setState({
					kryptoBirdz: props.context.state.kryptoBirdz
				});
				kbird = null;
				props.context.setState({showSell: false});
				setLoadShow(true);
				window.alert("NFT Successfully placed on sale with entered value");
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
		<Loader loaded={loaderShow} options={options}>
		</Loader>
        </Modal.Body>
        <Modal.Footer>
            {/* <Button onClick={() => transfer(props.contract, props.from, inp, props.tokenid, props.context)}>Send</Button> */}
            <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

export default Sell;