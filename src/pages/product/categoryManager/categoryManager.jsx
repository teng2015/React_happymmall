/*
* @Author: Rosen
* @Date:   2018-02-04 21:34:16
* @Last Modified by:   Rosen
* @Last Modified time: 2018-02-04 22:49:58
*/
import React        from 'react';
import { Link }     from 'react-router-dom';
import Mutil        from 'util/util.jsx'
import Product      from 'service/product_server.jsx'

import PageTitle    from 'component/pageTitle/pageTitle.jsx'
import TableList    from 'util/generaldutyTable/table.jsx'

const _mm           = new Mutil ();
const _product      = new Product();

class CategoryList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            list                : [],
            parentCategoryId    : this.props.match.params.categoryId || 0
        };
    }
    componentDidMount(){
        this.loadCategoryList();
    }

    componentDidUpdate(prevProps, prevState){
      console.log(this.props.match.params.categoryId );
        let oldPath = prevProps.location.pathname,
            newPath = this.props.location.pathname,
            newId   = this.props.match.params.categoryId || 0;
        if(oldPath !== newPath){
            this.setState({
                parentCategoryId : newId
            }, () => {
                this.loadCategoryList();
            });
        }
    }
    // 加载品类列表
    loadCategoryList(){
        _product.getCategoryList(this.state.parentCategoryId).then(res => {
            this.setState({
                list : res
            });
        }, errMsg => {
            this.setState({
                list : []
            });
            _mm.errorTips(errMsg);
        });
    }
    // 更新品类的名字
    onUpdateName(categoryId, categoryName){
        let newName = window.prompt('请输入新的品类名称', categoryName);
        if(newName){
            _product.updateCategoryName({
                categoryId: categoryId,
                categoryName : newName
            }).then(res => {
                _mm.successTips(res);
                this.loadCategoryList();
            }, errMsg => {
                _mm.errorTips(errMsg);
            });
        }
    }
    render(){
      let tableHead=[
            {name:'品类ID' ,width:'20%'},
            {name:'品类名称',width:'60%'},
            {name:'操作'   ,width:'20%'}
          ];
        let listBody = this.state.list.map((category, index) => {
            return (
                <tr key={index}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>
                        <a className="opear" onClick={(e) => this.onUpdateName(category.id, category.name)}>修改名称</a>
                        {
                            category.parentId === 0
                            ? <Link to={`/product-category/index/${category.id}`}>查看子品类</Link>
                            : null
                        }
                    </td> 
                </tr>
            );
        });
        return (
            <div id="page-wrapper">
                <PageTitle title={this.state.parentCategoryId===0?'品类列表':'子品类列表'}>
                    <div className="page-header-right">
                        <Link to="/product/category-add/" className="btn btn-primary">
                            <i className="fa fa-plus"></i>
                            <span>添加品类</span>
                        </Link>
                    </div>
                </PageTitle>
                <div className="row">
                    <div className="col-md-12">
                        <p>父品类ID: {this.state.parentCategoryId}</p>
                    </div>
                </div>
                <TableList tableHead={tableHead}>
                    {listBody}
                </TableList>
            </div>
        );
    }
}

export default CategoryList;