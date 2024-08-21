import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import {
  FiLogOut,
  FiArchive,
  FiFilePlus,
  FiPlusSquare,
  FiFileText,
} from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "./Bill.css";

const initBillObj = {
  customer: {
    name: "",
    email: "",
    phone_number: "",
    address: "",
  },
  items: [
    { name: "", qty: "", price: "", total: "" },
    { name: "", qty: "", price: "", total: "" },
    { name: "", qty: "", price: "", total: "" },
    { name: "", qty: "", price: "", total: "" }
  ],
  discount: "",
  payable_amount: ""
};

const Bill = () => {

  const [bill, setBill] = useState(initBillObj);

  const onChangeItemNameHandler = (evt, index) => {
    let _billItems = [...bill.items];
    _billItems[index].name = evt.target.value;
    setBill({ ...bill, items: _billItems });
  }

  const onChangeItemQtyHandler = (evt, index) => {
    let _billItems = [...bill.items];
    const _qty = parseFloat(evt.target.value) || 0;
    const _price = parseFloat(_billItems[index].price) || 0;
    _billItems[index].qty = _qty;
    _billItems[index].total = (_price * _qty).toFixed(2);
    setBill({ ...bill, items: _billItems });
    calculateTotalPayableAmount();
  }

  const onChangeItemPriceHandler = (evt, index) => {
    let _billItems = [...bill.items];
    const _price = parseFloat(evt.target.value) || 0;
    const _qty = parseFloat(_billItems[index].qty) || 0;
    _billItems[index].price = _price;
    _billItems[index].total = (_price * _qty).toFixed(2);
    setBill({ ...bill, items: _billItems });
    calculateTotalPayableAmount();
  }

  const addMoreItemRowHandler = () => {
    setBill({...bill, items:[...bill.items, { name: "", qty: "", price: "", total: "" }]});
    //console.log(bill);
  }

  const removeItemRowHandler = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to remove this item",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0d6efd",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        let _billItems = [...bill.items];
        _billItems.splice(index, 1);
        setBill({ ...bill, items: _billItems });
        calculateTotalPayableAmount();
      }
    });
  };

  const billDiscountHandler = (e) => {
    // Get the new discount value from the event
    const discount = parseFloat(e.target.value) || 0;
  
    // Update the state with the new discount value
    setBill(prevBill => ({
      ...prevBill,
      discount: discount // Store discount as a string with two decimal places
    }));
    //setBill({ ...bill, discount: discount });
    
    // Recalculate the total payable amount with the updated discount
    calculateTotalPayableAmount();
  };

  const calculateTotalPayableAmount = () => {
    let _bill = bill;
    let _payableAmount = 0;
    let _discount = parseFloat(bill.discount) || 0;
    console.log("D=" + _discount);

    if (bill.items.length > 0) {
      bill.items.forEach((item) => {
        const total = parseFloat(item.total) || 0;
        _payableAmount += total;
      });
    }

    _payableAmount -= _discount; 

    //setBill({ ...bill, payable_amount: _payableAmount.toFixed(2) || "0" });
    setBill(prevBill => ({
      ...prevBill,
      payable_amount: _payableAmount.toFixed(2) // Format payable amount as a string with two decimal places
    }));
  }

  const formSubmitButtonHandler = () => {
    document.getElementById("formHiddenSubmitBtn").click();
  };

  const itemCollectionFrmSubmitHandler = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Please wait...",
      html: "System is <strong>processing</strong> your request",
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    }).then(() => {
      Swal.close();
      toast.success("Bill has been generated successfully!");
    });
  }

  return (
    <>
      <Container fluid="md">
        <Row className="mt-5">
          <Col xs={12} sm={12} md={4}>
            <h1>
              <FiArchive className="icon-adjust-10 text-primary mx-2" />
              <strong>Just Billing</strong>
            </h1>
          </Col>
          <Col xs={12} sm={12} md={8} className="onex-text-content-right-align">
            <Dropdown>
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                Hello Arindam
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href="#/action-3">
                  <FiLogOut className="icon-adjust-2" /> Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col xs={12} sm={12} md={12}>
            <Card>
              <Card.Header>
                <Row>
                  <Col xs={12} sm={12} md={4}>
                    <FiFilePlus className="icon-adjust-2 text-primary" />{" "}
                    <strong>Create New Bill</strong>
                  </Col>
                  <Col xs={12} sm={12} md={8} className="onex-text-content-right-align">
                    <span><strong>Total Items: {bill.items.length}</strong></span>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={itemCollectionFrmSubmitHandler}>
                  {bill.items.length > 0 &&
                    bill.items.map((item, index) => {
                      return (
                        <Row key={"billItemRow-" + index}>
                          <Col xs={12} sm={12} md={4}>
                            <Form.Group
                              className="mb-3"
                              controlId={"billItemName-" + index}
                            >
                              {index === 0 && (
                                <Form.Label>
                                  <strong>Item Name:</strong>
                                </Form.Label>
                              )}
                              <Form.Control
                                type="text"
                                name={"bill_item_name[" + index + "]"}
                                value={item.name}
                                placeholder="Enter Item"
                                required
                                onChange={(e) =>
                                  onChangeItemNameHandler(e, index)
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col xs={12} sm={12} md={2}>
                            <Form.Group
                              className="mb-3"
                              controlId={"billItemQty-" + index}
                            >
                              {index === 0 && (
                                <Form.Label>
                                  <strong>Quantity:</strong>
                                </Form.Label>
                              )}
                              <Form.Control
                                type="number"
                                name={"bill_item_qty[" + index + "]"}
                                value={item.qty}
                                min={1}
                                placeholder="QTY"
                                required
                                onChange={(e) =>
                                  onChangeItemQtyHandler(e, index)
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col xs={12} sm={12} md={2}>
                            <Form.Group
                              className="mb-3"
                              controlId={"billItemPrice-" + index}
                            >
                              {index === 0 && (
                                <Form.Label>
                                  <strong>Price:</strong>
                                </Form.Label>
                              )}
                              <Form.Control
                                type="number"
                                name={"bill_item_price[" + index + "]"}
                                value={item.price}
                                min={1}
                                placeholder="Price"
                                required
                                onChange={(e) =>
                                  onChangeItemPriceHandler(e, index)
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col xs={12} sm={12} md={2}>
                            <Form.Group
                              className="mb-3"
                              controlId={"billItemAmount-" + index}
                            >
                              {index === 0 && (
                                <Form.Label>
                                  <strong>Total:</strong>
                                </Form.Label>
                              )}
                              <Form.Control
                                type="number"
                                name={"bill_item_total[" + index + "]"}
                                value={item.total}
                                min={1}
                                placeholder="Total"
                                disabled
                                readOnly
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col xs={12} sm={12} md={2}>
                            {index > 0 && (
                              <MdDelete 
                                className="row-delete-icon-adjust text-danger"
                                onClick={() => removeItemRowHandler(index)} />
                            )}
                          </Col>
                        </Row>
                      );
                    })}
                    <Row>
                      <Col xs={12} sm={12} md={4}></Col>
                      <Col xs={12} sm={12} md={2}><strong>Discount:</strong></Col>
                      <Col xs={12} sm={12} md={2}>
                        <Form.Group
                          className="mb-3"
                          controlId="billDiscount"
                        >
                          <Form.Control
                            type="number"
                            name="bill_discount"
                            min={1}
                            placeholder="Discount"
                            value={bill.discount}
                            onChange={billDiscountHandler}
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={12} md={2}>
                        <Form.Group
                          className="mb-3"
                          controlId="payableAmount"
                        >
                          <Form.Control
                            type="number"
                            name="payable_amount"
                            value={bill.payable_amount || "0"}
                            min={1}
                            placeholder="Payable Amount"
                            disabled
                            readOnly
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Button
                      type="submit"
                      id="formHiddenSubmitBtn"
                      variant="secondary"
                      className="d-none"
                    >
                      Submit
                    </Button>
                </Form>
              </Card.Body>
              <Card.Footer>
                <Row>
                  <Col xs={12} sm={12} md={6}>
                    <Button variant="primary" onClick={addMoreItemRowHandler}>
                      <FiPlusSquare className="icon-adjust-2" /> Add More Item
                    </Button>{" "}
                    <Button variant="success" onClick={formSubmitButtonHandler}>
                      <FiFileText className="icon-adjust-2" /> Generate Bill
                    </Button>{" "}
                  </Col>
                  <Col xs={12} sm={12} md={6} className="onex-text-content-right-align">
                    <span><strong>Total Payable Amount: {bill.payable_amount || "0"}</strong></span>
                  </Col>
                </Row>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Bill;
