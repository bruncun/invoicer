export const options = {
  useNewQueryKeys: true,
  projectId: "AGpg3C-5yTuaG-cOKhCy",
};

export const resources = [
  {
    name: "invoices",
    list: "/invoices",
    create: "/invoices/create",
    edit: "/invoices/edit/:id",
    show: "/invoices/show/:id",
    meta: {
      canDelete: true,
    },
  },
];
