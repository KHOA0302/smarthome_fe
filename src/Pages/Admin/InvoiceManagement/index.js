import ListOrders from "../../../Component/ListOrders";

function InvoiceManagement() {
  return (
    <div>
      <button>pending</button>
      <div>
        <ListOrders orderStatus={"pending"} />
      </div>
    </div>
  );
}

export default InvoiceManagement;
