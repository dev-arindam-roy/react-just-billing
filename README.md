# A Billing Application For All

## It's FREE! FREE!

# Check the Application, USE IT. It's FREE !!!
[https://dev-arindam-roy.github.io/react-just-billing/](https://dev-arindam-roy.github.io/react-just-billing/)

### Loging Screen
![Screenshot 2024-08-24 225520](https://github.com/user-attachments/assets/62ef0da3-7d84-45d1-90ab-0703cb4e3d16)

### Billing Screen
![Screenshot 2024-08-24 225932](https://github.com/user-attachments/assets/e80efad4-037c-4b9e-bbef-9537d0163b2f)

### Generate Bill
![Screenshot 2024-08-24 230004](https://github.com/user-attachments/assets/32f7854e-eeb0-40e5-b728-d867e7d8a563)

### Print or Save As PDF
![Screenshot 2024-08-24 230033](https://github.com/user-attachments/assets/9e6ac5c5-d571-4c34-ac8b-4509dc5b7c7f)





```js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { toWords } from 'number-to-words';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import {
  FiLogOut,
  FiArchive,
  FiFilePlus,
  FiPlusSquare,
  FiFileText,
  FiLogIn,
  FiInfo,
  FiUser,
  FiUserCheck,
  FiUserPlus,
  FiEdit,
  FiSave,
  FiPrinter,
  FiX,
} from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import './Bill.css';

const initBillObj = {
  items: [
    { name: '', qty: '', price: '', total: '' },
    { name: '', qty: '', price: '', total: '' },
  ],
  discount: '',
  payable_amount: '',
};

const resetInitBillObj = {
  items: [
    { name: '', qty: '', price: '', total: '' },
    { name: '', qty: '', price: '', total: '' },
  ],
  discount: '',
  payable_amount: '',
};

const initBillerInfo = {
  name: '',
  email: '',
  phno: '',
  address: '',
  gst_no: '',
};

const initCustomerInfo = {
  name: '',
  email: '',
  phno: '',
  address: '',
};

const Bill = () => {
  const [bill, setBill] = useState(initBillObj);
  const [isBillModalShow, setIsBillModalShow] = useState(false);
  const [isLoginModalShow, setIsLoginModalShow] = useState(true);
  const [isBillerModalShow, setIsBillerModalShow] = useState(false);
  const [isCustomerModalShow, setIsCustomerModalShow] = useState(false);
  const [authName, setAuthName] = useState('');
  const [authUsername, setAuthUsername] = useState(
    process.env.REACT_APP_USERNAME
  );
  const [authPassword, setAuthPassword] = useState(
    process.env.REACT_APP_PASSWORD
  );
  const [billerInfo, setBillerInfo] = useState(initBillerInfo);
  const [customerInfo, setCustomerInfo] = useState(initCustomerInfo);

  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const checkAuth = () => {
    let isAuth = localStorage.getItem('GIT_JUST_BILLING_AUTH') || null;
    if (isAuth) {
      let authName =
        localStorage.getItem('GIT_JUST_BILLING_AUTH_NAME') || 'User';
      setIsLoginModalShow(false);
      setAuthName(authName);
    } else {
      setIsLoginModalShow(true);
    }
  };

  const logoutHandler = (e) => {
    e.preventDefault();
    setAuthName('');
    localStorage.setItem('GIT_JUST_BILLING_AUTH', null);
    localStorage.setItem('GIT_JUST_BILLING_AUTH_NAME', null);
    localStorage.setItem('GIT_JUST_BILLING_BILLER_INFO', null);
    localStorage.removeItem('GIT_JUST_BILLING_AUTH');
    localStorage.removeItem('GIT_JUST_BILLING_AUTH_NAME');
    localStorage.removeItem('GIT_JUST_BILLING_BILLER_INFO');
    setCustomerInfo(initCustomerInfo);
    setBillerInfo(initBillerInfo);
    setBill(resetInitBillObj);
    setIsLoginModalShow(true);
    toast.success('You have sign-out successfully!');
  };

  useEffect(() => {
    checkAuth();
  }, [isLoginModalShow]);

  const signInButtonHandler = () => {
    document.getElementById('signInFormHiddenSubmitBtn').click();
  };

  const signinFormHandler = (e) => {
    e.preventDefault();
    if (
      authUsername === process.env.REACT_APP_USERNAME &&
      authPassword === process.env.REACT_APP_PASSWORD
    ) {
      localStorage.setItem('GIT_JUST_BILLING_AUTH', true);
      localStorage.setItem('GIT_JUST_BILLING_AUTH_NAME', authName);
      setIsLoginModalShow(false);
      toast.success(`Hi! Welcome to account ${authName}`);
    } else {
      localStorage.setItem('GIT_JUST_BILLING_AUTH', null);
      localStorage.setItem('GIT_JUST_BILLING_AUTH_NAME', null);
      localStorage.removeItem('GIT_JUST_BILLING_AUTH');
      localStorage.removeItem('GIT_JUST_BILLING_AUTH_NAME');
      setIsLoginModalShow(true);
      toast.error('Sorry! Username and Password is wrong');
    }
  };

  const cancelBillingHandler = () => {
    setBill(resetInitBillObj);
    setCustomerInfo(initCustomerInfo);
  };

  const onChangeItemNameHandler = (evt, index) => {
    let _billItems = [...bill.items];
    _billItems[index].name = evt.target.value;
    setBill({ ...bill, items: _billItems });
  };

  const onChangeItemQtyHandler = (evt, index) => {
    let _billItems = [...bill.items];
    const _qty = parseFloat(evt.target.value) || 0;
    const _price = parseFloat(_billItems[index].price) || 0;
    _billItems[index].qty = _qty;
    _billItems[index].total = (_price * _qty).toFixed(2);
    setBill({ ...bill, items: _billItems });
    calculateTotalPayableAmount();
  };

  const onChangeItemPriceHandler = (evt, index) => {
    let _billItems = [...bill.items];
    const _price = parseFloat(evt.target.value) || 0;
    const _qty = parseFloat(_billItems[index].qty) || 0;
    _billItems[index].price = _price;
    _billItems[index].total = (_price * _qty).toFixed(2);
    setBill({ ...bill, items: _billItems });
    calculateTotalPayableAmount();
  };

  const addMoreItemRowHandler = () => {
    setBill({
      ...bill,
      items: [...bill.items, { name: '', qty: '', price: '', total: '' }],
    });
  };

  const removeItemRowHandler = (index) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to remove this item',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Yes',
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
    const discount = parseFloat(e.target.value) || 0;
    setBill((prevBill) => ({
      ...prevBill,
      discount: discount,
    }));
  };

  const calculateTotalPayableAmount = useCallback(() => {
    let _payableAmount = 0;
    let _discount = parseFloat(bill.discount) || 0;

    if (bill.items.length > 0) {
      bill.items.forEach((item) => {
        let total = parseFloat(item.total) || 0;
        _payableAmount += total;
      });
    }

    _payableAmount -= _discount;
    setBill((prevBill) => ({
      ...prevBill,
      payable_amount: _payableAmount.toFixed(2),
    }));
  }, [bill.items, bill.discount]);

  useEffect(() => {
    calculateTotalPayableAmount();
  }, [bill.items, bill.discount, calculateTotalPayableAmount]);

  const formSubmitButtonHandler = () => {
    document.getElementById('formHiddenSubmitBtn').click();
  };

  const itemCollectionFrmSubmitHandler = (e) => {
    e.preventDefault();
    if (customerInfo.name === '' || customerInfo.phno === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Customer Information Not Set',
        footer: 'Please add the customer information and proceed',
        confirmButtonColor: '#0d6efd',
      });
    } else if (billerInfo.name === '' || billerInfo.phno === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Biller Information Not Set',
        footer: 'Please add the biller information and proceed',
        confirmButtonColor: '#0d6efd',
      });
    } else {
      Swal.fire({
        title: 'Please wait...',
        html: 'System is <strong>processing</strong> your request',
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
      }).then(() => {
        Swal.close();
        setIsBillModalShow(true);
        toast.success('Bill has been generated successfully!');
      });
    }
  };

  const billModalCloseHandler = () => {
    setIsBillModalShow(false);
  };

  /** Biller Modal */
  const billerInfonButtonHandler = () => {
    document.getElementById('billerInfoFormHiddenSubmitBtn').click();
  };

  const billerModalCloseHandler = () => {
    setIsBillerModalShow(false);
  };

  const showBillerInfoModal = () => {
    setIsBillerModalShow(true);
  };

  const billerFormSubmitHandler = (e) => {
    e.preventDefault();
    localStorage.setItem(
      'GIT_JUST_BILLING_BILLER_INFO',
      JSON.stringify(billerInfo)
    );
    setIsBillerModalShow(false);
  };

  useEffect(() => {
    let billerInfo =
      JSON.parse(localStorage.getItem('GIT_JUST_BILLING_BILLER_INFO')) ||
      initBillerInfo;
    setBillerInfo(billerInfo);
  }, []);

  /** Customer Modal */
  const customerInfonButtonHandler = () => {
    document.getElementById('customerInfoFormHiddenSubmitBtn').click();
  };

  const customerModalCloseHandler = () => {
    setIsCustomerModalShow(false);
  };

  const showCustomerInfoModal = () => {
    setIsCustomerModalShow(true);
  };

  const customerFormSubmitHandler = (e) => {
    e.preventDefault();
    setIsCustomerModalShow(false);
  };

  return (
    <>
      <Container fluid='md'>
        <Row className='mt-5'>
          <Col xs={12} sm={12} md={4}>
            <h1>
              <FiArchive className='icon-adjust-10 text-primary mx-2' />
              <strong>Just Billing</strong>
            </h1>
          </Col>
          <Col xs={12} sm={12} md={8} className='onex-text-content-right-align'>
            {!isLoginModalShow && (
              <Dropdown>
                <Dropdown.Toggle variant='primary' id='dropdown-basic'>
                  <FiUser className='icon-adjust-2' /> Hello{' '}
                  {authName || 'User'}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    href='#/billing-info'
                    onClick={showBillerInfoModal}
                  >
                    <FiInfo className='icon-adjust-2' /> Biller Info
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item href='#/logout' onClick={logoutHandler}>
                    <FiLogOut className='icon-adjust-2' /> Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Col>
        </Row>
        <Row className='mt-3'>
          <Col xs={12} sm={12} md={6}>
            <Card>
              <Card.Header>
                <Row>
                  <Col xs={12} sm={12} md={6}>
                    <FiUserCheck className='icon-adjust-2' />{' '}
                    <strong>Biller Information</strong>
                  </Col>
                  <Col
                    xs={12}
                    sm={12}
                    md={6}
                    className='onex-text-content-right-align'
                  >
                    <FiEdit
                      className='icon-adjust-2 mouse-hover'
                      onClick={showBillerInfoModal}
                    />
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <Table size='sm'>
                  <tbody>
                    <tr>
                      <th>Name:</th>
                      <td>{billerInfo.name || '---'}</td>
                    </tr>
                    <tr>
                      <th>Email:</th>
                      <td>{billerInfo.email || '---'}</td>
                    </tr>
                    <tr>
                      <th>Phone:</th>
                      <td>{billerInfo.phno || '---'}</td>
                    </tr>
                    <tr>
                      <th>Address:</th>
                      <td>{billerInfo.address || '---'}</td>
                    </tr>
                    <tr>
                      <th>GST No:</th>
                      <td>{billerInfo.gst_no || '---'}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card>
              <Card.Header>
                <Row>
                  <Col xs={12} sm={12} md={6}>
                    <FiUserPlus className='icon-adjust-2' />{' '}
                    <strong>Customer Information</strong>
                  </Col>
                  <Col
                    xs={12}
                    sm={12}
                    md={6}
                    className='onex-text-content-right-align'
                  >
                    <FiEdit
                      className='icon-adjust-2 mouse-hover'
                      onClick={showCustomerInfoModal}
                    />
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <Table size='sm'>
                  <tbody>
                    <tr>
                      <th>Name:</th>
                      <td>{customerInfo.name || '---'}</td>
                    </tr>
                    <tr>
                      <th>Email:</th>
                      <td>{customerInfo.email || '---'}</td>
                    </tr>
                    <tr>
                      <th>Phone:</th>
                      <td>{customerInfo.phno || '---'}</td>
                    </tr>
                    <tr>
                      <th>Address:</th>
                      <td>{customerInfo.address || '---'}</td>
                    </tr>
                    <tr>
                      <th>Date:</th>
                      <td>
                        {new Date()
                          .toLocaleDateString('en-GB')
                          .replace(/\//g, '/')}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className='mt-2 mb-5'>
          <Col xs={12} sm={12} md={12}>
            <Card>
              <Card.Header>
                <Row>
                  <Col xs={12} sm={12} md={4}>
                    <FiFilePlus className='icon-adjust-2' />{' '}
                    <strong>Create New Bill</strong>
                  </Col>
                  <Col
                    xs={12}
                    sm={12}
                    md={8}
                    className='onex-text-content-right-align'
                  >
                    <span>
                      <strong>Total Items: {bill.items.length}</strong>
                    </span>
                  </Col>
                </Row>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={itemCollectionFrmSubmitHandler}>
                  {bill.items.length > 0 &&
                    bill.items.map((item, index) => {
                      return (
                        <Row key={'billItemRow-' + index}>
                          <Col xs={12} sm={12} md={4}>
                            <Form.Group
                              className='mb-3'
                              controlId={'billItemName-' + index}
                            >
                              {index === 0 && (
                                <Form.Label>
                                  <strong>Item Name:</strong>
                                </Form.Label>
                              )}
                              <Form.Control
                                type='text'
                                name={'bill_item_name[' + index + ']'}
                                value={item.name}
                                placeholder='Enter Item'
                                required
                                onChange={(e) =>
                                  onChangeItemNameHandler(e, index)
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col xs={12} sm={12} md={2}>
                            <Form.Group
                              className='mb-3'
                              controlId={'billItemQty-' + index}
                            >
                              {index === 0 && (
                                <Form.Label>
                                  <strong>Quantity:</strong>
                                </Form.Label>
                              )}
                              <Form.Control
                                type='number'
                                name={'bill_item_qty[' + index + ']'}
                                value={item.qty}
                                min={1}
                                placeholder='QTY'
                                required
                                onChange={(e) =>
                                  onChangeItemQtyHandler(e, index)
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col xs={12} sm={12} md={2}>
                            <Form.Group
                              className='mb-3'
                              controlId={'billItemPrice-' + index}
                            >
                              {index === 0 && (
                                <Form.Label>
                                  <strong>Price:</strong>
                                </Form.Label>
                              )}
                              <Form.Control
                                type='number'
                                name={'bill_item_price[' + index + ']'}
                                value={item.price}
                                min={1}
                                placeholder='Price'
                                required
                                onChange={(e) =>
                                  onChangeItemPriceHandler(e, index)
                                }
                              />
                            </Form.Group>
                          </Col>
                          <Col xs={12} sm={12} md={2}>
                            <Form.Group
                              className='mb-3'
                              controlId={'billItemAmount-' + index}
                            >
                              {index === 0 && (
                                <Form.Label>
                                  <strong>Total:</strong>
                                </Form.Label>
                              )}
                              <Form.Control
                                type='number'
                                name={'bill_item_total[' + index + ']'}
                                value={item.total}
                                min={1}
                                placeholder='Total'
                                disabled
                                readOnly
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col xs={12} sm={12} md={2}>
                            {index > 0 && (
                              <MdDelete
                                className='row-delete-icon-adjust text-danger'
                                onClick={() => removeItemRowHandler(index)}
                              />
                            )}
                          </Col>
                        </Row>
                      );
                    })}
                  <Row>
                    <Col xs={12} sm={12} md={4}></Col>
                    <Col xs={12} sm={12} md={2}>
                      <strong>Discount:</strong>
                    </Col>
                    <Col xs={12} sm={12} md={2}>
                      <Form.Group className='mb-3' controlId='billDiscount'>
                        <Form.Control
                          type='number'
                          name='bill_discount'
                          min={0}
                          placeholder='Discount'
                          value={bill.discount}
                          onChange={billDiscountHandler}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={12} md={2}>
                      <Form.Group className='mb-3' controlId='payableAmount'>
                        <Form.Control
                          type='number'
                          name='payable_amount'
                          value={bill.payable_amount || '0'}
                          min={1}
                          placeholder='Payable Amount'
                          disabled
                          readOnly
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button
                    type='submit'
                    id='formHiddenSubmitBtn'
                    variant='secondary'
                    className='d-none'
                  >
                    Submit
                  </Button>
                </Form>
              </Card.Body>
              <Card.Footer>
                <Row>
                  <Col xs={12} sm={12} md={6}>
                    <Button variant='primary' onClick={addMoreItemRowHandler}>
                      <FiPlusSquare className='icon-adjust-2' /> Add More Item
                    </Button>{' '}
                    <Button variant='success' onClick={formSubmitButtonHandler}>
                      <FiFileText className='icon-adjust-2' /> Generate Bill
                    </Button>{' '}
                    {customerInfo.name !== '' && (
                      <Button variant='danger' onClick={cancelBillingHandler}>
                        <FiFileText className='icon-adjust-2' /> Cancel Bill
                      </Button>
                    )}
                  </Col>
                  <Col
                    xs={12}
                    sm={12}
                    md={6}
                    className='onex-text-content-right-align'
                  >
                    <span>
                      <strong>
                        Total Payable Amount: {bill.payable_amount || '0'}
                      </strong>
                    </span>
                  </Col>
                </Row>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
        <Row className='mt-5 mb-2'>
          <Col md={12}>
            <p style={{textAlign: 'center', color: '#ccc', fontSize: '14px'}}>Sponsored By: Arindam Roy | 9836395513</p>
          </Col>
        </Row>
      </Container>

      {/* Generate Bill Modal */}
      <Modal
        backdrop='static'
        keyboard={false}
        show={isBillModalShow}
        onHide={billModalCloseHandler}
        size='lg'
        centered
        scrollable
      >
        <Modal.Body
          ref={printRef}
          style={{ marginTop: '20px', padding: '15px' }}
        >
          <Row className='bill-print-header'>
            <Col xs={12} sm={12} md={6} style={{ width: '50%' }}>
              <p>
                <span className='bill-name'>
                  <strong>{billerInfo.name}</strong>
                </span>
              </p>
              <p>
                <span className='bill-phno'>{billerInfo.phno}</span>{' '}
                {billerInfo.email !== '' && (
                  <span className='bill-email'> / {billerInfo.email}</span>
                )}
              </p>
              <p>
                <span className='bill-address'>{billerInfo.address}</span>
              </p>
              {billerInfo.gst_no !== '' && (
                <p>
                  <span className='bill-gst'>GST No: {billerInfo.gst_no}</span>
                </p>
              )}
            </Col>
            <Col
              xs={12}
              sm={12}
              md={6}
              className='onex-text-content-right-align'
              style={{ width: '50%' }}
            >
              <p>
                <span className='bill-name'>
                  <strong>{customerInfo.name}</strong>
                </span>
              </p>
              <p>
                <span className='bill-phno'>{customerInfo.phno}</span>{' '}
                {customerInfo.email !== '' && (
                  <span className='bill-email'> / {customerInfo.email}</span>
                )}
              </p>
              <p>
                <span className='bill-address'>{customerInfo.address}</span>
              </p>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col>
              <Table striped bordered hover size='sm' style={{ width: '100%' }}>
                <thead className='bill-print-thead'>
                  <tr>
                    <td
                      colSpan={5}
                      className='invoice-box'
                      style={{ textAlign: 'right' }}
                    >
                      <strong>Invoice No:</strong>{' '}
                      {Math.floor(Math.random() * (999999 - 100000 + 1)) +
                        100000}
                      <br />
                      <strong>Date:</strong>{' '}
                      {new Date()
                        .toLocaleDateString('en-GB')
                        .replace(/\//g, '/')}
                    </td>
                  </tr>
                  <tr>
                    <th colSpan={5} style={{ backgroundColor: '#ddd' }}>
                      Bill Items
                    </th>
                  </tr>
                  <tr>
                    <th>SL.</th>
                    <th>Items</th>
                    <th>QTY</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody className='bill-print-tbody'>
                  {bill.items.length > 0 &&
                    bill.items.map((item, index) => {
                      return (
                        <tr key={'bill-item-tabrow' + index}>
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td>{item.qty}</td>
                          <td>{item.price}</td>
                          <td>{item.total}</td>
                        </tr>
                      );
                    })}
                  <tr>
                    <th colSpan={4} style={{ textAlign: 'right' }}>
                      Discount
                    </th>
                    <td>{parseFloat(bill.discount).toFixed(2) || '0.00'}</td>
                  </tr>
                  <tr>
                    <th colSpan={4} style={{ textAlign: 'right' }}>
                      Total Payable Amount
                    </th>
                    <td>{bill.payable_amount || '0.00'}</td>
                  </tr>
                </tbody>
                <tfoot className='bill-print-tfoot'>
                  <tr>
                    <th colSpan={5}>
                      <span style={{color: '#ccc'}}>In Words:</span> <br /> <span className='number-text'>{toWords(bill.payable_amount || '0.00')}</span>
                    </th>
                  </tr>
                  <tr>
                    <th
                      colSpan={5}
                      style={{ textAlign: 'right', backgroundColor: '#ccc' }}
                    >
                      Thank You!
                    </th>
                  </tr>
                </tfoot>
              </Table>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={billModalCloseHandler}>
            <FiX className='icon-adjust-4' /> Close
          </Button>
          <Button variant='success' onClick={handlePrint}>
            <FiPrinter className='icon-adjust-4' /> Print Bill
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Auth Login Modal */}
      <Modal
        backdrop='static'
        keyboard={false}
        show={isLoginModalShow}
        dialogClassName='blur-backdrop'
        centered
        scrollable
      >
        <Modal.Header>
          <Modal.Title>
            <FiLogIn className='icon-adjust-2' /> Sign-In
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={signinFormHandler}>
            <Row>
              <Col>
                <Form.Group className='mb-3' controlId='authName'>
                  <Form.Control
                    type='text'
                    name='auth_name'
                    placeholder='Your Name'
                    value={authName}
                    required
                    onChange={(e) => setAuthName(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className='mb-3' controlId='authUserName'>
                  <Form.Control
                    type='text'
                    name='auth_username'
                    placeholder='Username'
                    value={authUsername}
                    required
                    onChange={(e) => setAuthUsername(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className='mb-3' controlId='authPassword'>
                  <Form.Control
                    type='password'
                    name='auth_password'
                    placeholder='Password'
                    value={authPassword}
                    required
                    onChange={(e) => setAuthPassword(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button
              type='submit'
              id='signInFormHiddenSubmitBtn'
              variant='secondary'
              className='d-none'
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={signInButtonHandler}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Biller Information Modal */}
      <Modal
        backdrop='static'
        keyboard={false}
        show={isBillerModalShow}
        onHide={billerModalCloseHandler}
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FiUserCheck className='icon-adjust-2' /> Biller Information
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={billerFormSubmitHandler}>
            <Row>
              <Col>
                <Form.Group className='mb-3' controlId='billerName'>
                  <Form.Control
                    type='text'
                    name='biller_name'
                    placeholder='Biller Name'
                    value={billerInfo.name}
                    required
                    onChange={(e) =>
                      setBillerInfo({ ...billerInfo, name: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className='mb-3' controlId='billerEmail'>
                  <Form.Control
                    type='email'
                    name='biller_email'
                    placeholder='Biller Email'
                    value={billerInfo.email}
                    onChange={(e) =>
                      setBillerInfo({ ...billerInfo, email: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className='mb-3' controlId='billerPhno'>
                  <Form.Control
                    type='text'
                    name='biller_phno'
                    placeholder='Biller Phone'
                    value={billerInfo.phno}
                    required
                    onChange={(e) =>
                      setBillerInfo({ ...billerInfo, phno: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className='mb-3' controlId='billerAddress'>
                  <Form.Control
                    as='textarea'
                    rows={2}
                    name='biller_address'
                    placeholder='Biller Address'
                    value={billerInfo.address}
                    required
                    onChange={(e) =>
                      setBillerInfo({ ...billerInfo, address: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className='mb-3' controlId='billerGstNo'>
                  <Form.Control
                    type='text'
                    name='biller_gst'
                    placeholder='Biller GST'
                    value={billerInfo.gst_no}
                    onChange={(e) =>
                      setBillerInfo({ ...billerInfo, gst_no: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button
              type='submit'
              id='billerInfoFormHiddenSubmitBtn'
              variant='secondary'
              className='d-none'
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={billerInfonButtonHandler}>
            <FiSave className='icon-adjust-4' /> Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Customer Information Modal */}
      <Modal
        backdrop='static'
        keyboard={false}
        show={isCustomerModalShow}
        onHide={customerModalCloseHandler}
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FiUserPlus className='icon-adjust-2' /> Customer Information
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={customerFormSubmitHandler}>
            <Row>
              <Col>
                <Form.Group className='mb-3' controlId='customerName'>
                  <Form.Control
                    type='text'
                    name='customer_name'
                    placeholder='Customer Name'
                    value={customerInfo.name}
                    required
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, name: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className='mb-3' controlId='customerEmail'>
                  <Form.Control
                    type='email'
                    name='customer_email'
                    placeholder='Customer Email'
                    value={customerInfo.email}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        email: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className='mb-3' controlId='customerPhno'>
                  <Form.Control
                    type='text'
                    name='customer_phno'
                    placeholder='Customer Phone'
                    value={customerInfo.phno}
                    required
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, phno: e.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className='mb-3' controlId='customerAddress'>
                  <Form.Control
                    as='textarea'
                    rows={2}
                    name='customer_address'
                    placeholder='Customer Address'
                    value={customerInfo.address}
                    required
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        address: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button
              type='submit'
              id='customerInfoFormHiddenSubmitBtn'
              variant='secondary'
              className='d-none'
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='primary' onClick={customerInfonButtonHandler}>
            <FiSave className='icon-adjust-4' /> Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Bill;

```

# Check the Application, USE IT. It's FREE !!!
[https://dev-arindam-roy.github.io/react-just-billing/](https://dev-arindam-roy.github.io/react-just-billing/)
