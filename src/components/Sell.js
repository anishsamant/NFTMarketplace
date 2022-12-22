import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBCardFooter } from 'mdb-react-ui-kit';

function Sell(props) {
	const [sellingPrice, setSellingPrice] = useState(0);
	let index = 0;
	const myBirdz = []
	for(let i = 0; i < props.kryptoBirdz.length; i++) {
		if(props.kryptoBirdz[i].owner == props.account){
			myBirdz[index++] = props.kryptoBirdz[i];
		}
	}
	const listItems = myBirdz.map((kbird, index) => 
		<MDBCard key={kbird.kryptoBird} className='token img' style={{maxWidth: '25rem'}}>
			<MDBCardImage 
				src={kbird.kryptoBird}
				alt={kbird.kryptoBird}
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
				<button className='sell-btn' onClick={() => sellNFT()}>Sell</button>
			</MDBCardFooter>
		</MDBCard>
	);

	function sellNFT(){
		console.log('button clicked', sellingPrice);
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