import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBCardFooter } from 'mdb-react-ui-kit';

function sellNFT(){
	console.log('button clicked');
}

function Popup(props) {
    const [inp, setInp] = useState('');
	let index = 0;
	const myBirdz = []
	for(let i = 0; i < props.kryptoBirdz.length; i++) {
		if(props.kryptoBirdz[i].owner == props.account){
			myBirdz[index++] = props.kryptoBirdz[i];
		}
	}
	const listItems = this.state.kryptoBirdz.map((kbird, index) => 
		<MDBCard key={kbird.kryptoBird} className='token img' style={{maxWidth: '25rem'}}>
			<MDBCardImage 
				src={kbird.kryptoBird}
				alt={kbird.kryptoBird}
				position='top'
				height= '250px'
			/>
			<MDBCardBody>
				<MDBCardTitle className="projects-card-title">KryptoBirdz</MDBCardTitle>
				<MDBCardText className="projects-card-text">
					<span>Owner: <span style={{color: '#0608A3', fontSize: '18px'}}>{kbird.owner}</span></span>
				</MDBCardText>
			</MDBCardBody>
			<MDBCardFooter className="projects-card-footer">
				<button onClick={() => sellNFT()}>Sell</button>
			</MDBCardFooter>
		</MDBCard>
	);

    return (
      <Modal
        {...props}
        size="lg"
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

export default Popup;