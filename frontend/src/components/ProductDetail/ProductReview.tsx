import { formatCountDate } from "@/helpers/helpers";
import { Product } from "@/types/Product.type";
import { StarIcon } from "@heroicons/react/16/solid";

interface Props {
	product: Product;
}

const ProductReview = ({ product }: Props) => {
	return (
		<aside className="w-full px-4">
			<h5 className="text-gray-700 text-2xl mt-3">Reviews</h5>

			<div className="space-y-4">
				{product.reviews.length > 0 ? (
					product.reviews.map((review, index) => (
						<div
							key={index}
							className={`p-4 ${
								index !== product.reviews.length - 1
									? "border-b border-gray-200"
									: ""
							} bg-transparent`}
						>
							<div className="">
								<div className="flex gap-2">
									<span className="flex items-center gap-1">
										{Array.from({ length: 5 }, (_, i) => (
											<StarIcon
												key={i}
												width={16}
												color={i < review.rating ? "orange" : "gray"}
											/>
										))}
									</span>
									<p className="text-gray-500 text-sm">
										{formatCountDate(review.createdAt)}
									</p>
								</div>
								<h6 className="text-gray-700 font-semibold">
									{review.reviewerName}
								</h6>
							</div>
							<p className="text-sm text-gray-700 mt-1">{review.comment}</p>
						</div>
					))
				) : (
					<p className="text-gray-500">
						No reviews available for this product.
					</p>
				)}
			</div>
		</aside>
	);
};

export default ProductReview;
