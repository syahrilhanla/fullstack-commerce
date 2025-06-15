import { formatCountDate } from "@/helpers/helpers";
import { Product } from "@/types/Product.type";
import { StarIcon } from "@heroicons/react/16/solid";

interface Props {
	product: Product;
}

const ProductReview = ({ product }: Props) => {
	return (
		<aside className="w-full px-2 sm:px-4">
			<h5 className="text-gray-700 text-lg sm:text-2xl mt-3 font-semibold">
				Reviews
			</h5>

			<div className="space-y-2 sm:space-y-4">
				{product.reviews.length > 0 ? (
					product.reviews.map((review, index) => (
						<div
							key={index}
							className={`p-2 sm:p-4 rounded-md ${
								index !== product.reviews.length - 1
									? "border-b border-gray-200"
									: ""
							} bg-transparent`}
						>
							<div className="flex flex-col gap-1">
								<div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 w-full justify-between">
									<span className="flex items-center gap-1 flex-shrink-0">
										{Array.from({ length: 5 }, (_, i) => (
											<StarIcon
												key={i}
												width={14}
												className="sm:w-4 sm:h-4"
												color={i < review.rating ? "orange" : "gray"}
											/>
										))}
									</span>
									<p className="text-gray-500 text-xs sm:text-sm whitespace-nowrap">
										{formatCountDate(review.createdAt)}
									</p>
								</div>
								<h6 className="text-gray-700 font-semibold text-xs sm:text-base truncate max-w-full">
									{review.reviewerName}
								</h6>
							</div>
							<p className="text-xs sm:text-sm text-gray-700 mt-1 break-words">
								{review.comment}
							</p>
						</div>
					))
				) : (
					<p className="text-gray-500 text-sm sm:text-base">
						No reviews available for this product.
					</p>
				)}
			</div>
		</aside>
	);
};

export default ProductReview;
