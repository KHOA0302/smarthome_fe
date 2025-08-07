import { v4 } from "uuid";

const initState = {
  productInfo: {},
  productImgs: [],
  variants: [],
  servicePackages: [],
  attributeGroups: [],
  loading: true,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      const {
        productInfo,
        productImgs,
        variants,
        servicePackages,
        attributeGroups,
      } = action.payload;

      const updateServicePackages = servicePackages.map((sp) => {
        const newItems = sp.items.map((item) => {
          return {
            ...item,
            itemPriceImpact: parseInt(item.itemPriceImpact),
            isRemove: false,
          };
        });

        return {
          ...sp,
          items: newItems,
          isRemove: false,
        };
      });

      const updateAttributeGroups = attributeGroups.map((group) => {
        return {
          ...group,
          attributes: group.attributes.map((attribute) => {
            return {
              ...attribute,
              attributeValues: [
                ...attribute.attributeValues.map((value) => {
                  return {
                    ...value,
                    isRemove: false,
                  };
                }),
              ],
            };
          }),
        };
      });

      return {
        ...state,
        loading: false,
        error: null,
        productInfo,
        productImgs: [
          ...productImgs.map((img) => {
            return {
              ...img,
              isRemove: false,
            };
          }),
        ],
        variants: [
          ...variants.map((variant) => {
            return {
              ...variant,
              price: parseInt(variant.price),
              isRemove: false,
            };
          }),
        ],
        servicePackages: [...updateServicePackages],
        attributeGroups: [...updateAttributeGroups],
      };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "ADD_TEMP_IMG":
      const { img_id, image_url, isRemove, file, display_order } =
        action.payload;

      return {
        ...state,
        productImgs: [
          ...state.productImgs,
          {
            img_id,
            image_url,
            isRemove,
            file,
            display_order,
          },
        ],
      };
    case "DELETE_IMG":
      const imgId = action.payload;

      const newProductImgs = state.productImgs.map((img) => {
        if (img.img_id === imgId) {
          return {
            ...img,
            isRemove: !img.isRemove,
          };
        }
        return img;
      });

      return {
        ...state,
        productImgs: [...newProductImgs],
      };
    case "DELETE_VARIANT":
      const variantId = action.payload;

      const newVariants = state.variants.map((variant) => {
        if (variant.variant_id === variantId) {
          return { ...variant, isRemove: !variant.isRemove };
        }
        return variant;
      });
      return {
        ...state,
        variants: [...newVariants],
      };
    case "CHANGE_VARIANT_TEMP_IMG":
      const { variantIdChangeImg, imageUrlVariant, fileVariant } =
        action.payload;

      const _newVariants = state.variants.map((variant) => {
        if (variant.variant_id === variantIdChangeImg) {
          return {
            ...variant,
            image_url: imageUrlVariant,
            file: fileVariant,
          };
        }
        return variant;
      });

      return { ...state, variants: [..._newVariants] };
    case "EDIT_VARIANT_NAME":
      const { editNameVariantId, variantName } = action.payload;
      const __newVariants = state.variants.map((variant) => {
        if (variant.variant_id === editNameVariantId) {
          return {
            ...variant,
            variant_name: variantName,
          };
        }
        return variant;
      });
      return {
        ...state,
        variants: [...__newVariants],
      };
    case "EDIT_VARIANT_PRICE":
      const { editPriceVariantId, variantPrice } = action.payload;
      const ___newVariants = state.variants.map((variant) => {
        if (variant.variant_id === editPriceVariantId) {
          return {
            ...variant,
            price: variantPrice,
          };
        }
        return variant;
      });
      return {
        ...state,
        variants: [...___newVariants],
      };
    case "EDIT_VARIANT_QUANTITY":
      const { editQuantityVariantId, variantQuantity } = action.payload;
      if (variantQuantity < 0) {
        return state;
      }
      const ____newVariants = state.variants.map((variant) => {
        if (variant.variant_id === editQuantityVariantId) {
          return {
            ...variant,
            stock_quantity: variantQuantity,
          };
        }
        return variant;
      });
      return {
        ...state,
        variants: [...____newVariants],
      };
    case "ADD_PACKAGE":
      const addVariantId = action.payload;
      const addNewPackage = {
        variant_id: addVariantId,
        packageName: "",
        packageId: v4(),
        items: [
          {
            atLeastOne: false,
            isRemove: false,
            itemId: v4(),
            itemName: "",
            itemPriceImpact: 0,
            selectable: true,
            serviceId: "",
          },
        ],
        isRemove: false,
      };

      return {
        ...state,
        servicePackages: [...state.servicePackages, addNewPackage],
      };
    case "ADD_SERVICE":
      const addPackageId = action.payload;
      const addNewPackages = state.servicePackages.map((sp) => {
        if (sp.packageId === addPackageId) {
          const newItem = {
            atLeastOne: false,
            isRemove: false,
            itemId: v4(),
            itemName: "",
            itemPriceImpact: 0,
            selectable: true,
            serviceId: "",
          };

          return {
            ...sp,
            items: [...sp.items, newItem],
          };
        }
        return sp;
      });
      return {
        ...state,
        servicePackages: [...addNewPackages],
      };
    case "DELETE_PACKAGE":
      const deletePackageId = action.payload;

      const deleteNewPackages = state.servicePackages.map((sp) => {
        if (sp.packageId === deletePackageId) {
          return {
            ...sp,
            isRemove: !sp.isRemove,
          };
        }
        return sp;
      });
      return {
        ...state,
        servicePackages: [...deleteNewPackages],
      };
    case "DELETE_SERVICE":
      const { _deletePackageId, deleteServiceId } = action.payload;
      const _deleteNewPackages = state.servicePackages.map((sp) => {
        if (sp.packageId === _deletePackageId) {
          const newItems = sp.items.map((item) => {
            if (item.itemId === deleteServiceId) {
              return {
                ...item,
                isRemove: !item.isRemove,
              };
            }
            return item;
          });
          return {
            ...sp,
            items: [...newItems],
          };
        }
        return sp;
      });
      return { ...state, servicePackages: [..._deleteNewPackages] };
    case "EDIT_SERVICE_SELECTABLE":
      const { editSelectAblePackageId, editSelectAbleItemId } = action.payload;

      const editSelectableNewPackages = state.servicePackages.map((sp) => {
        if (sp.packageId === editSelectAblePackageId) {
          const newItems = sp.items.map((item) => {
            if (item.itemId === editSelectAbleItemId) {
              return {
                ...item,
                selectable: !item.selectable,
              };
            }
            return item;
          });

          return {
            ...sp,
            items: [...newItems],
          };
        }
        return sp;
      });
      return {
        ...state,
        servicePackages: [...editSelectableNewPackages],
      };
    case "EDIT_SERVICE_AT_LEAST_ONE":
      const { editAtLeastOnePackageId, editAtLeastOneItemId } = action.payload;

      const editAtLeastOneNewPackages = state.servicePackages.map((sp) => {
        if (sp.packageId === editAtLeastOnePackageId) {
          const newItems = sp.items.map((item) => {
            if (item.itemId === editAtLeastOneItemId) {
              return {
                ...item,
                atLeastOne: !item.atLeastOne,
              };
            }
            return item;
          });

          return {
            ...sp,
            items: [...newItems],
          };
        }
        return sp;
      });
      return {
        ...state,
        servicePackages: [...editAtLeastOneNewPackages],
      };
    case "EDIT_PACKAGE_NAME":
      const { editPackageNameValue, editNamePackageId } = action.payload;

      const editNameNewServicePackages = state.servicePackages.map((sp) => {
        if (sp.packageId === editNamePackageId) {
          return {
            ...sp,
            packageName: editPackageNameValue,
          };
        }
        return sp;
      });

      return {
        ...state,
        servicePackages: [...editNameNewServicePackages],
      };
    case "EDIT_SERVICE_VALUE":
      const {
        editServiceValueId,
        editServiceValueName,
        editServiceValuePackageId,
        editServiceValueItemId,
      } = action.payload;

      const editServiceValueNewServicePackages = state.servicePackages.map(
        (sp) => {
          if (sp.packageId === editServiceValuePackageId) {
            const newItems = sp.items.map((item) => {
              if (item.itemId === editServiceValueItemId) {
                return {
                  ...item,
                  serviceId: editServiceValueId,
                  itemName: editServiceValueName,
                };
              }
              return item;
            });
            return {
              ...sp,
              items: [...newItems],
            };
          }
          return sp;
        }
      );

      return {
        ...state,
        servicePackages: [...editServiceValueNewServicePackages],
      };
    case "EDIT_SERVICE_PRICE":
      const {
        editServicePriceValue,
        editPricePackageId,
        editPriceServiceItemId,
      } = action.payload;

      const editPriceNewServicePackages = state.servicePackages.map((sp) => {
        if (sp.packageId === editPricePackageId) {
          const newItems = sp.items.map((item) => {
            if (item.itemId === editPriceServiceItemId) {
              return {
                ...item,
                itemPriceImpact: editServicePriceValue,
              };
            }
            return item;
          });
          return {
            ...sp,
            items: [...newItems],
          };
        }
        return sp;
      });
      return {
        ...state,
        servicePackages: [...editPriceNewServicePackages],
      };
    case "ADD_SPECIFICATION":
      const { addSpecGroupId, addSpecAttributeId } = action.payload;

      const addSpecNewAttributeGroups = state.attributeGroups.map((group) => {
        if (group.groupId === addSpecGroupId) {
          const newAttributes = group.attributes.map((attribute) => {
            if (attribute.attributeId === addSpecAttributeId) {
              const newAttributeValue = {
                attributeValueId: v4(),
                attributeValueName: "",
              };

              return {
                ...attribute,
                attributeValues: [
                  ...attribute.attributeValues,
                  newAttributeValue,
                ],
              };
            }
            return attribute;
          });
          return {
            ...group,
            attributes: [...newAttributes],
          };
        }
        return group;
      });

      return {
        ...state,
        attributeGroups: [...addSpecNewAttributeGroups],
      };
    case "DELETE_SPECIFICATION":
      const { deleteSpecGroupId, deleteSpecAttributeId, deleteSpecValueId } =
        action.payload;

      const deleteSpecNewAttributeGroups = state.attributeGroups.map(
        (group) => {
          if (group.groupId === deleteSpecGroupId) {
            const newAttributes = group.attributes.map((attribute) => {
              if (attribute.attributeId === deleteSpecAttributeId) {
                const newAttributeValues = attribute.attributeValues.map(
                  (value) => {
                    if (value.attributeValueId === deleteSpecValueId) {
                      return {
                        ...value,
                        isRemove: !value.isRemove,
                      };
                    }
                    return value;
                  }
                );

                return {
                  ...attribute,
                  attributeValues: [...newAttributeValues],
                };
              }

              return attribute;
            });
            return {
              ...group,
              attributes: [...newAttributes],
            };
          }
          return group;
        }
      );

      return {
        ...state,
        attributeGroups: [...deleteSpecNewAttributeGroups],
      };

    case "CHANGE_VALUE_SPECIFICATION":
      const {
        changeValueGroupId,
        changeValueAttributeId,
        changeValueItemId,
        changeValue,
      } = action.payload;

      const changeValueNewAttributeGroups = state.attributeGroups.map(
        (group) => {
          if (group.groupId === changeValueGroupId) {
            const newAttributes = group.attributes.map((attribute) => {
              if (attribute.attributeId === changeValueAttributeId) {
                const newAttributeValues = attribute.attributeValues.map(
                  (value) => {
                    if (value.attributeValueId === changeValueItemId) {
                      return {
                        ...value,
                        attributeValueName: changeValue,
                      };
                    }
                    return value;
                  }
                );

                return {
                  ...attribute,
                  attributeValues: [...newAttributeValues],
                };
              }
              return attribute;
            });

            return {
              ...group,
              attributes: [...newAttributes],
            };
          }

          return group;
        }
      );
      return {
        ...state,
        attributeGroups: [...changeValueNewAttributeGroups],
      };

    default:
      return state;
  }
};

export { reducer, initState };
