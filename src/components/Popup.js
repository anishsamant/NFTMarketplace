import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function transfer(contract, from, to, tokenId, context) {
    console.log(tokenId);
    contract.methods.transferFrom(from, to, tokenId).send({from: from})
    .on('confirmation', (con) => {
        if (tokenId) {
            let item = {...context.state.kryptoBirdz[tokenId]};
            item.owner = to;
            context.state.kryptoBirdz[tokenId] = item;
            context.setState({
                kryptoBirdz: context.state.kryptoBirdz
            });
            tokenId = null;
            context.setState({showPopup: false});
            window.alert("Ownership successfully transferred");
        }
    });
}

function Popup(props) {
    const [inp, setInp] = useState('');
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Transfer Token
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>To Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="metamask public address"
                autoFocus
                onInput = {e => setInp(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={() => transfer(props.contract, props.from, inp, props.tokenid, props.context)}>Send</Button>
            <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

export default Popup;