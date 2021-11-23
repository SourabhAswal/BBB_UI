import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import '../module/admin/UploadSpeaker.css'
import paginationFactory, { PaginationProvider, SizePerPageDropdownStandalone, PaginationTotalStandalone, PaginationListStandalone } from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
const { SearchBar } = Search;

export default class Table extends React.Component {

    render() {

        const { columns, data,defaultSorted } = this.props
        return (
            <div className="col-lg-12">
                <div className="card mb-4" style={{ marginTop: "20px", width: "100%", height: "100%" }}>
                    <div className="table-responsive p-3" >
                        <PaginationProvider

                            pagination={paginationFactory({
                                custom: true,
                                paginationSize: 4,
                                pageStartIndex: 1,
                                firstPageText: '<<',
                                prePageText: '<',
                                nextPageText: '>',
                                lastPageText: '>>',
                                // hideSizePerPage: true,
                                showTotal: true,
                                sizePerPageList: [

                                    {
                                        text: "5",
                                        value: 5
                                    },
                                    {
                                        text: "10",
                                        value: 10
                                    },
                                    {
                                        text: "15",
                                        value: 15
                                    },
                                    {
                                        text: "All",
                                        value: data.length
                                    }
                                ],

                                hideSizePerPage: false
                            })}
                            keyField="id"
                            columns={columns}
                            data={data}
                        >
                            {({ paginationProps, paginationTableProps }) => (
                                <ToolkitProvider
                                    keyField="id"
                                    columns={columns}
                                    data={data}
                                    search

                                >

                                    {toolkitprops => (
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', margin: "12px", }}>
                                                <SizePerPageDropdownStandalone
                                                    {...paginationProps}


                                                />
                                                <SearchBar {...toolkitprops.searchProps} />
                                            </div>
                                            <BootstrapTable striped

                                                {...toolkitprops.baseProps}
                                                {...paginationTableProps}
                                                defaultSorted={defaultSorted}
                                                condensed
                                                noDataIndication="No Data Is Available"

                                            />
                                            <div style={{ display: 'flex', justifyContent: 'space-between', margin: "20px" }}>
                                                <PaginationTotalStandalone
                                                    {...paginationProps}
                                                />
                                                <PaginationListStandalone
                                                    {...paginationProps}
                                                /></div>
                                        </div>
                                    )}
                                </ToolkitProvider>
                            )}
                        </PaginationProvider>

                    </div>
                </div>
            </div>
        )
    }




}