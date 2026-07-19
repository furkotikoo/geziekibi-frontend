import { FileSearchBarProps } from "@/Types/FileManagerType";
import { ChangeEvent } from "react";
import { Form, Input } from "reactstrap";

const SearchBar: React.FC<FileSearchBarProps> = ({
  searchFile,
  setSearchFile,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setSearchFile(e.target.value);
  };
  return (
    <Form className="form-inline">
      <div className="form-group d-flex align-items-center mb-0">
        <i className="fa fa-search" />
        <Input
          type="text"
          placeholder="Search..."
          plaintext
          onChange={handleChange}
          value={searchFile}
        />
      </div>
    </Form>
  );
};
export default SearchBar;
