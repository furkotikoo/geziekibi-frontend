import { Href } from "@/Constant/constant";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Document } from "@/Types/ApiResponseType";

export interface HoverButtonsProp {
  item: Document;
  setDataId: (id: number) => void;
  setOpenPreviewModal: (key: boolean) => void;
  setOpenEditModal: (key: boolean) => void;
}

export const HoverButtons: React.FC<HoverButtonsProp> = ({
  item,
  setDataId,
  setOpenPreviewModal,
  setOpenEditModal,
}) => {
  const router = useRouter();

  const onClickPreview = (i: Document) => {
    setOpenPreviewModal(true);
    setDataId(i.id);
  };

  const onClickEdit = (i: Document) => {
    setOpenEditModal(true);
    setDataId(i.id);
  };

  return (
    <div className="product-hover">
      <ul>
        {item.id > 0 ? (
          <>
            <li>
              <Link
                href={Href}
                color="transparent"
                onClick={() => onClickEdit(item)}
              >
                <i className="icon-pencil"></i>
              </Link>
            </li>
            <li>
              <Link
                href={Href}
                color="transparent"
                onClick={() => onClickPreview(item)}
              >
                <i className="icon-eye"></i>
              </Link>
            </li>
          </>
        ) : (
          <li>
            <Link
              href={Href}
              color="transparent"
              onClick={() => onClickEdit(item)}
            >
              <i className="icon-pencil"></i>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
};
